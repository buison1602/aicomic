-- Cập nhật bảng stories thêm trường thumbnail_url (nếu chưa có)
-- Chỉ chạy lệnh này nếu migration ban đầu chưa tạo trường này

-- Kiểm tra cấu trúc bảng hiện tại:
PRAGMA table_info(stories);

-- Nếu không thấy trường thumbnail_url, chạy lệnh sau:
ALTER TABLE stories ADD COLUMN thumbnail_url TEXT;

-- Verify lại:
PRAGMA table_info(stories);

-- Kết quả mong đợi:
-- 0|id|INTEGER|0||1
-- 1|slug|TEXT|1||0
-- 2|title|TEXT|1||0
-- 3|author|TEXT|0||0
-- 4|status|TEXT|0||0
-- 5|genres|TEXT|0||0
-- 6|description|TEXT|0||0
-- 7|thumbnail_url|TEXT|0||0      <-- Trường mới
-- 8|created_at|DATETIME|0|CURRENT_TIMESTAMP|0
