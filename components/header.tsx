import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
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

        {/* Right: Search, Post Comic, and Login */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted rounded-md transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/truyen/dang-truyen">
            <Button variant="outline" size="sm">
              Đăng truyện
            </Button>
          </Link>
          <Button variant="default" size="sm">
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  )
}
