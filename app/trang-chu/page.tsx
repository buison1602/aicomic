import FormTrangChu from './FormTrangChu';

// XÓA runtime='edge' để giảm bundle size
// Trang này giờ là Static, data fetch từ Client qua API

export default function TrangChuPage() {
  return <FormTrangChu />;
}
