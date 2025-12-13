-- Migration: Remove chapterName field from chapters table

-- Kiểm tra cấu trúc bảng chapters hiện tại:
PRAGMA table_info(chapters);

-- SQLite không hỗ trợ ALTER TABLE DROP COLUMN trực tiếp
-- Cần tạo lại bảng mới:

-- 1. Tạo bảng mới không có chapterName
CREATE TABLE chapters_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_slug TEXT NOT NULL,
    chapter_number REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_slug) REFERENCES stories(slug)
);

-- 2. Copy dữ liệu từ bảng cũ (bỏ qua chapterName)
INSERT INTO chapters_new (id, story_slug, chapter_number, created_at)
SELECT id, story_slug, chapter_number, created_at
FROM chapters;

-- 3. Xóa bảng cũ
DROP TABLE chapters;

-- 4. Đổi tên bảng mới thành chapters
ALTER TABLE chapters_new RENAME TO chapters;

-- 5. Xác nhận cấu trúc mới
PRAGMA table_info(chapters);

-- Kết quả mong đợi:
-- 0|id|INTEGER|0||1
-- 1|story_slug|TEXT|1||0
-- 2|chapter_number|REAL|1||0
-- 3|created_at|DATETIME|0|CURRENT_TIMESTAMP|0
