import FormDangTruyen from './FormDangTruyen';
import { headers } from 'next/headers';

// Cấu hình bắt buộc để chạy trên Cloudflare Pages
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function DangTruyenPageWrapper() {
  // Gọi headers() để ép Next.js hiểu đây là Dynamic 100%
  await headers();
  
  return <FormDangTruyen />;
}
