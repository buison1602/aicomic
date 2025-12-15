'use client';

import dynamic from 'next/dynamic';

// Dynamic import với ssr: false chỉ hoạt động trong Client Component
const FormDangTruyen = dynamic(() => import('./FormDangTruyen'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Đang tải form đăng truyện...</p>
    </div>
  ),
});

export default function ClientWrapper() {
  return <FormDangTruyen />;
}
