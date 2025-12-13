import { drizzle as drizzleD1 } from 'drizzle-orm/d1'
import * as schema from './schema'

/**
 * Lấy kết nối Database
 * Tự động chuyển đổi giữa D1 (Cloudflare) và SQLite (Local)
 */
export function getDb() {
  // 1. Kiểm tra nếu đang chạy trên Edge Runtime (Cloudflare)
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Lấy binding D1 từ biến môi trường
    // Lưu ý: @cloudflare/next-on-pages gắn binding vào process.env.DB
    const dbBinding = (process.env as any).DB || (globalThis as any).DB;

    if (!dbBinding) {
      // Trong quá trình build static, có thể binding chưa tồn tại
      // Ta ném lỗi hoặc trả về null tuỳ logic, nhưng ở đây cần crash nếu chạy thật
       console.warn('⚠️ Running in Edge but no DB binding found. Check "DB" binding in Cloudflare Dashboard.');
    }
    
    // Khởi tạo Drizzle với D1
    return drizzleD1(dbBinding, { schema });
  }

  // 2. Nếu không phải Edge thì là Node.js (Local Development)
  // Dùng require() để import động -> Tránh lỗi 'fs' khi build lên Edge
  console.log('🔧 [DB] Running in LOCAL mode with better-sqlite3');
  
  const Database = require('better-sqlite3');
  const { drizzle: drizzleSQLite } = require('drizzle-orm/better-sqlite3');

  const sqlite = new Database('local.sqlite');
  return drizzleSQLite(sqlite, { schema });
}

// Giữ tương thích với code cũ nếu bạn có dùng export db
// Tuy nhiên khuyên dùng getDb() để đảm bảo biến môi trường đã load
export const db = getDb();