import ClientWrapper from './ClientWrapper';
import { headers } from 'next/headers';

// Cấu hình bắt buộc
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function DangChapPageWrapper() {
  // Gọi headers() để ép Next.js hiểu đây là Dynamic 100%
  await headers();
  
  return <ClientWrapper />;
}
