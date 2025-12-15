import { headers } from 'next/headers';
import dynamic from 'next/dynamic';

// Lazy load FormDangChap để giảm kích thước Server Function
const FormDangChap = dynamic(() => import('./FormDangChap'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen"><p>Đang tải form...</p></div>
});

// Cấu hình bắt buộc
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function DangChapPageWrapper() {
  // Gọi headers() để ép Next.js hiểu đây là Dynamic 100%
  await headers();
  
  return <FormDangChap />;
}
