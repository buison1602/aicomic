'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/login-dialog"

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    // Sign out without page reload
    await signOut({ redirect: false });
    // Manually navigate to home page
    router.push('/trang-chu');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/trang-chu" className="text-2xl font-bold text-foreground">
            AICommic
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/trang-chu" className="text-sm font-medium hover:text-primary transition-colors">
              TRANG CHỦ
            </Link>
            <Link href="/danh-sach" className="text-sm font-medium hover:text-primary transition-colors">
              DANH SÁCH
            </Link>
            <Link href="/lien-he" className="text-sm font-medium hover:text-primary transition-colors">
              LIÊN HỆ
            </Link>
          </nav>
        </div>

        {/* Right: Search, Post Comic, and Login/Logout */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted rounded-md transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/truyen/dang-truyen">
            <Button variant="outline" size="sm">
              Đăng truyện
            </Button>
          </Link>
          
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {session.user?.name || session.user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          ) : (
            <LoginDialog />
          )}
        </div>
      </div>
    </header>
  )
}
