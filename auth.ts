import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Demo - Replace with real DB check
        if (credentials.email === "demo@example.com" && credentials.password === "password") {
          return {
            id: "1",
            email: "demo@example.com",
            name: "Demo User",
          }
        }
        return null
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Only create user record for OAuth providers (Google, etc.)
        if (account?.provider === "google" && user.email) {
          const db = getDb();
          
          // Check if user already exists
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1);

          // Create user if doesn't exist
          if (existingUser.length === 0) {
            await db.insert(users).values({
              id: user.id,
              email: user.email,
              name: user.name || null,
              image: user.image || null,
              emailVerified: null,
            });
            console.log(`✅ Created new user in DB: ${user.email}`);
          } else {
            console.log(`ℹ️  User already exists: ${user.email}`);
          }
        }
        return true;
      } catch (error) {
        console.error("❌ Error in signIn callback:", error);
        return true; // Still allow sign in even if DB insert fails
      }
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
