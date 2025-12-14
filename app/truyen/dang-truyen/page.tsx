import FormDangTruyen from './FormDangTruyen';

// Cấu hình bắt buộc để chạy trên Cloudflare Pages
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function DangTruyenPageWrapper() {
  return <FormDangTruyen />;
}
