import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
// <CHANGE> Import shared Header and Footer components
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter"
})

export const metadata: Metadata = {
  // <CHANGE> Update metadata for comic website
  title: "AICommic - Đọc truyện tranh online",
  description: "Nền tảng đọc truyện tranh trực tuyến hàng đầu",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="font-sans antialiased flex flex-col min-h-screen bg-white text-gray-800">
        {/* <CHANGE> Add global Header */}
        <Header />
        {/* <CHANGE> Main content wrapper */}
        <main className="flex-1">{children}</main>
        {/* <CHANGE> Add global Footer */}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
