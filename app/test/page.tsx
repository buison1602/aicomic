// app/test-page.tsx
'use client'

import { useState } from 'react';
import { testR2Connection } from '@/app/test/actions';

export default function R2TestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult('Đang kiểm tra kết nối...');
    
    const response = await testR2Connection();

    if (response.success) {
      setResult(`✅ ${response.message}`);
    } else {
      setResult(`❌ ${response.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-lg mx-auto border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Kiểm tra kết nối Cloudflare R2</h2>
      <button 
        onClick={handleTest} 
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Đang chạy Test...' : 'Chạy Test Kết nối'}
      </button>
      
      <div className="mt-4 p-3 bg-gray-100 border rounded min-h-[50px]">
        <p className="font-mono text-sm whitespace-pre-wrap">{result}</p>
      </div>
      
      <p className="mt-4 text-sm text-gray-500">
        *Lưu ý: Nếu kết quả báo thành công (✅), bạn có thể bắt đầu code chức năng Upload và Get File.
      </p>
    </div>
  );
}