import FormTrangChu from './FormTrangChu';
import { headers } from 'next/headers';

// Cấu hình bắt buộc để tải dữ liệu mới nhất từ Database
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function TrangChuPageWrapper() {
  // Gọi headers() để ép Next.js hiểu đây là Dynamic 100%
  await headers();
  
  return <FormTrangChu />;
}
