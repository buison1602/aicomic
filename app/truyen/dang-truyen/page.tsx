import { headers } from 'next/headers';
import dynamic from 'next/dynamic';

// Lazy load FormDangTruyen để giảm kích thước Server Function
const FormDangTruyen = dynamic(() => import('./FormDangTruyen'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen"><p>Đang tải form...</p></div>
});

// Cấu hình bắt buộc để chạy trên Cloudflare Pages
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function DangTruyenPageWrapper() {
  // Gọi headers() để ép Next.js hiểu đây là Dynamic 100%
  await headers();
  
  return <FormDangTruyen />;
}
