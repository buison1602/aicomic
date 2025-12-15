'use client';

import dynamic from 'next/dynamic';

// Dynamic import với ssr: false chỉ hoạt động trong Client Component
const FormDangChap = dynamic(() => import('./FormDangChap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Đang tải form đăng chương...</p>
    </div>
  ),
});

export default function ClientWrapper() {
  return <FormDangChap />;
}
