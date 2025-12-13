# Hướng dẫn Upload Ảnh Đại Diện Truyện

## ✅ Đã hoàn thành

Tôi đã cập nhật form đăng truyện với chức năng upload ảnh đại diện. Dưới đây là chi tiết:

---

## 🗄️ Cập nhật Database

### Schema đã có sẵn trường `thumbnail_url`
Bảng `stories` trong schema Drizzle ORM đã có trường `thumbnailUrl`:
```typescript
thumbnailUrl: text('thumbnail_url')
```

### ❗ KHÔNG cần chạy lệnh ALTER TABLE
Nếu bạn đã chạy migration ban đầu (`drizzle/0000_lovely_harrier.sql`), bảng `stories` đã có trường `thumbnail_url` rồi.

### Kiểm tra bảng trên Cloudflare D1
Chạy lệnh này để kiểm tra:
```bash
npx wrangler d1 execute aicommic-database --remote --command "PRAGMA table_info(stories);"
```

Nếu **không thấy** trường `thumbnail_url`, chạy lệnh sau:
```bash
npx wrangler d1 execute aicommic-database --remote --command "ALTER TABLE stories ADD COLUMN thumbnail_url TEXT;"
```

---

## 📁 Files đã tạo/cập nhật

### 1. **lib/r2-upload.ts** (MỚI)
- Hàm `uploadToR2()`: Upload file lên R2 Storage
- Hàm `generateThumbnailKey()`: Tạo path cho file trên R2
- **Dev Mode**: Trả về URL giả (`https://dev-placeholder.local/r2/...`)
- **Production**: Upload thật lên R2 và trả về URL public

### 2. **app/truyen/dang-truyen/page.tsx** (ĐÃ SỬA)
- Thêm input file cho ảnh thumbnail
- Validation: chỉ chấp nhận JPG, PNG, WEBP (tối đa 5MB)
- Preview ảnh trước khi submit
- Hiển thị lỗi nếu không chọn ảnh

### 3. **app/truyen/dang-truyen/actions.ts** (ĐÃ SỬA)
- Nhận file từ FormData
- Gọi `uploadToR2()` để upload
- Lưu URL vào database

### 4. **package.json** (ĐÃ SỬA)
- Đã cài `@aws-sdk/client-s3` để kết nối R2

---

## 🧪 Test trong Development (Local)

### Khi bạn chạy `npm run dev:d1`

1. Truy cập: http://127.0.0.1:8788/truyen/dang-truyen
2. Điền form đăng truyện
3. **Chọn ảnh đại diện** (bắt buộc)
4. Click "Đăng truyện"

### ⚠️ Lưu ý Development Mode
- **File KHÔNG được upload thật** lên R2
- System sẽ trả về URL giả: `https://dev-placeholder.local/r2/stories/{slug}/thumbnail.{ext}`
- URL này được lưu vào database local (SQLite)
- Console sẽ hiển thị:
  ```
  📁 DEV MODE: Simulating R2 upload for: stories/tham-tu-conan/thumbnail.jpg
     File: conan.jpg Size: 245678 bytes
  📸 Thumbnail URL: https://dev-placeholder.local/r2/stories/tham-tu-conan/thumbnail.jpg
  ```

### Tại sao lại như vậy?
- **Nhanh hơn**: Không phải upload file thật trong development
- **An toàn hơn**: Không tốn băng thông R2 khi test
- **Dễ debug**: Thấy rõ flow mà không cần kết nối internet

---

## 🚀 Deploy lên Production

### Khi deploy lên Cloudflare Pages

1. **Đẩy code lên GitHub**
   ```bash
   git add .
   git commit -m "Add story thumbnail upload feature"
   git push
   ```

2. **Cloudflare Pages tự động deploy**
   - Build command: `npm run build`
   - Biến môi trường tự động được load từ Cloudflare Pages settings

3. **Ảnh sẽ được upload thật lên R2**
   - `process.env.NODE_ENV === 'production'` → Upload thật
   - File được lưu tại: `stories/{slug}/thumbnail.{ext}`
   - URL trả về: `https://your-r2-domain.com/stories/{slug}/thumbnail.{ext}`

### Cấu trúc file trên R2
```
your-bucket/
└── stories/
    ├── tham-tu-conan/
    │   └── thumbnail.jpg
    ├── one-piece/
    │   └── thumbnail.png
    └── naruto/
        └── thumbnail.webp
```

---

## 🔧 Environment Variables

### Đảm bảo file `.env.local` có đủ thông tin:
```env
# R2 Storage
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_DOMAIN=https://your-r2-domain.com

# D1 Database
CLOUDFLARE_DATABASE_ID=ec5a4359-9905-4b83-a20e-5a48e0993d3a
CLOUDFLARE_D1_TOKEN=your_d1_token
```

### Trên Cloudflare Pages Dashboard:
1. Settings → Environment Variables
2. Thêm tất cả biến trên cho **Production** và **Preview** environments

---

## 📝 Validation Rules

### File ảnh:
- ✅ Định dạng: JPG, JPEG, PNG, WEBP
- ✅ Kích thước: Tối đa 5MB
- ✅ Bắt buộc phải chọn

### Form validation:
- Tên truyện: ≥ 3 ký tự
- Tác giả: Không để trống
- Trạng thái: Phải chọn
- Thể loại: 1-5 thể loại
- Mô tả: 50-1000 ký tự
- **Ảnh đại diện: Bắt buộc**

---

## 🐛 Troubleshooting

### Lỗi "R2 credentials not found"
- Kiểm tra file `.env.local`
- Restart Wrangler: `npm run dev:d1`

### Lỗi "Failed to upload file to R2"
- Chỉ xảy ra ở production
- Kiểm tra R2 credentials trên Cloudflare Pages Dashboard
- Kiểm tra quyền của Access Key (phải có quyền PutObject)

### Preview ảnh không hiển thị
- Browser cần hỗ trợ `URL.createObjectURL()`
- Thử refresh trang

### File quá lớn
- Giảm kích thước ảnh xuống < 5MB
- Sử dụng công cụ nén ảnh online

---

## 🎯 Workflow Tổng Quan

### Development (Local):
```
User chọn ảnh
    ↓
Form validation
    ↓
Submit form
    ↓
Server Action nhận file
    ↓
uploadToR2() → Trả về URL giả
    ↓
Lưu URL vào SQLite local
    ↓
Thành công ✅
```

### Production (Cloudflare Pages):
```
User chọn ảnh
    ↓
Form validation
    ↓
Submit form
    ↓
Server Action nhận file
    ↓
uploadToR2() → Upload thật lên R2
    ↓
Lưu URL vào D1 Production
    ↓
Thành công ✅
```

---

## ✨ Tính năng

### UI/UX:
- ✅ Input file với accept filter
- ✅ Preview ảnh ngay khi chọn
- ✅ Hiển thị tên file và kích thước
- ✅ Nút xóa ảnh đã chọn
- ✅ Error messages rõ ràng
- ✅ Loading state khi submit

### Backend:
- ✅ File validation (type, size)
- ✅ Tự động generate storage key
- ✅ Dev mode simulation
- ✅ Production R2 upload
- ✅ Error handling

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console logs (F12 → Console)
2. Network tab (xem request/response)
3. Wrangler logs (terminal đang chạy `npm run dev:d1`)

---

**Chúc bạn code vui vẻ! 🚀**
