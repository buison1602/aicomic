/**
 * Danh sách thể loại truyện chung cho toàn bộ ứng dụng
 * Sử dụng ở: trang đăng truyện, trang danh sách, filter, v.v.
 */
export const ALL_GENRES = [
  "Hành động",
  "Phiêu lưu",
  "Hài hước",
  "Kinh dị",
  "Lãng mạn",
  "Giả tưởng",
  "Khoa học viễn tưởng",
  "Trinh thám",
  "Học đường",
  "Drama",
  "Võ thuật",
  "Siêu nhiên",
  "Chính kịch",
  "Kỳ ảo",
  "Bí ẩn",
  "Đời thường",
  "Thể thao",
] as const;

/**
 * Trạng thái truyện
 */
export const STORY_STATUS = [
  { value: "Đang ra", label: "Đang ra" },
  { value: "Hoàn thành", label: "Hoàn thành" },
  { value: "Tạm dừng", label: "Tạm dừng" },
] as const;
