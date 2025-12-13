# 🔐 Hướng dẫn setup Google OAuth cho đăng nhập

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Bật Google+ API:
   - Vào menu **APIs & Services** → **Library**
   - Tìm "Google+ API" và click **Enable**

## Bước 2: Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Chọn **Application type**: Web application
4. Nhập tên (ví dụ: "AICommic Local Dev")
5. **Authorized JavaScript origins**:
   ```
   http://localhost:8788
   http://127.0.0.1:8788
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:8788/api/auth/callback/google
   http://127.0.0.1:8788/api/auth/callback/google
   ```
7. Click **Create**

## Bước 3: Lấy Client ID và Client Secret

Sau khi tạo xong, bạn sẽ thấy:
- **Client ID**: Dạng `xxxxx.apps.googleusercontent.com`
- **Client Secret**: Chuỗi ký tự ngẫu nhiên

## Bước 4: Cập nhật file .env.local

1. Copy file `.env.local.example` thành `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Điền thông tin vào `.env.local`:
   ```env
   NEXTAUTH_URL=http://127.0.0.1:8788
   NEXTAUTH_SECRET=generate-secret-below
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

3. Generate NEXTAUTH_SECRET (chạy trong terminal):
   ```bash
   # Linux/Mac:
   openssl rand -base64 32
   
   # Windows PowerShell:
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

## Bước 5: Restart dev server

```bash
npm run dev
```

## Kiểm tra

1. Mở http://127.0.0.1:8788
2. Click nút **Đăng nhập**
3. Click **Đăng nhập bằng Google**
4. Chọn tài khoản Google
5. Đăng nhập thành công! ✅

## Troubleshooting

### Lỗi "redirect_uri_mismatch"
- Kiểm tra lại Authorized redirect URIs trong Google Console
- Đảm bảo URL khớp chính xác (http vs https, port number)

### Lỗi "access_denied"
- Bật Google+ API trong Google Cloud Console
- Kiểm tra OAuth consent screen đã được config

### Không hiển thị dialog đăng nhập
- Check browser console có lỗi không
- Restart dev server: `Ctrl+C` rồi `npm run dev`

## Production Setup

Khi deploy production, cần:
1. Thêm domain production vào Authorized origins
2. Thêm redirect URI production: `https://yourdomain.com/api/auth/callback/google`
3. Update `NEXTAUTH_URL` trong environment variables production
