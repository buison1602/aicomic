import FormDanhSach from './FormDanhSach';
import { headers } from 'next/headers';

// Cấu hình bắt buộc để tải dữ liệu mới nhất từ Database
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function DanhSachPageWrapper() {
  // Gọi headers() để ép Next.js hiểu đây là Dynamic 100%
  await headers();
  
  return <FormDanhSach />;
}
