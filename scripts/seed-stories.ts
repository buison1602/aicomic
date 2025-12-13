import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the local.sqlite file at project root (same as check-db.js)
const dbPath = path.resolve(__dirname, '../local.sqlite');
console.log(`📂 Using database: ${dbPath}\n`);

const db = new Database(dbPath);

// Sample data for seeding
const storyData = [
  {
    title: 'Đại Chúa Tể',
    author: 'Thiên Tằm Thổ Đậu',
    status: 'Đang ra',
    genres: 'Hành động, Giả tưởng, Võ thuật',
    description: 'Trong thế giới vĩ đại, những bậc tối cường có thể tạo nên trời đất, trấn áp sơn hà. Đại thế huyền ảo, tài năng vô số như vũ trụ sao la ra.',
  },
  {
    title: 'Võ Luyện Đỉnh Phong',
    author: 'Mạc Mặc',
    status: 'Đang ra',
    genres: 'Hành động, Võ thuật, Phiêu lưu',
    description: 'Thiên tài được sinh ra để vượt qua tất cả, trên con đường tu luyện, không có giới hạn nào có thể ngăn cản.',
  },
  {
    title: 'Thần Ấn Vương Toạ',
    author: 'Đường Gia Tam Thiếu',
    status: 'Hoàn thành',
    genres: 'Hành động, Giả tưởng, Phiêu lưu',
    description: 'Trong thế giới ma thú hoành hành, con người chiến đấu để sinh tồn. Sáu đại thần điện bảo vệ nhân loại trước cuộc xâm lăng của ma tộc.',
  },
  {
    title: 'Đấu Phá Thương Khung',
    author: 'Thiên Tằm Thổ Đậu',
    status: 'Hoàn thành',
    genres: 'Hành động, Giả tưởng, Võ thuật',
    description: 'Trong đại lục Đấu Khí, tu luyện Đấu Khí là con đường duy nhất để trở nên mạnh mẽ. Thiên tài trở thành phế vật, nhưng đó chỉ là khởi đầu của một huyền thoại.',
  },
  {
    title: 'Toàn Chức Pháp Sư',
    author: 'Loạn',
    status: 'Đang ra',
    genres: 'Hành động, Giả tưởng, Học đường',
    description: 'Thế giới pháp thuật toàn mới, nơi các pháp sư chiến đấu chống lại ma thú và bảo vệ thành phố. Một học sinh bình thường thức tỉnh với năng lực đặc biệt.',
  },
  {
    title: 'Nguyên Tôn',
    author: 'Thiên Tằm Thổ Đậu',
    status: 'Đang ra',
    genres: 'Hành động, Giả tưởng, Phiêu lưu',
    description: 'Thiên địa vạn vật đều có nguồn khí, người tu luyện có thể hấp thụ nguồn khí để tăng cường sức mạnh. Trong đại lục Thiên Nguyên, vô số thiên tài xuất hiện.',
  },
  {
    title: 'Tinh Võ Thần Quyết',
    author: 'Phong Thanh Dương',
    status: 'Đang ra',
    genres: 'Hành động, Võ thuật, Khoa học viễn tưởng',
    description: 'Khi văn minh tinh tú gặp gỡ với võ đạo cổ truyền, một kỷ nguyên mới của nhân loại bắt đầu.',
  },
  {
    title: 'Vạn Cổ Thần Đế',
    author: 'Phi Thiên Ngư',
    status: 'Đang ra',
    genres: 'Hành động, Giả tưởng, Võ thuật',
    description: 'Vạn năm trước, Minh Đế tọa hóa, để lại vô tận bí mật. Vạn năm sau, thiếu niên mang theo ký ức tiền kiếp trở về.',
  },
  {
    title: 'Tuyệt Thế Vũ Hồn',
    author: 'Cực Tốc Thỏ',
    status: 'Hoàn thành',
    genres: 'Hành động, Giả tưởng, Lãng mạn',
    description: 'Võ hồn là sức mạnh tối thượng trong đại lục này. Mỗi người có thể thức tỉnh võ hồn riêng, từ động vật đến thực vật, đến cả vũ khí.',
  },
  {
    title: 'Linh Vực',
    author: 'Nghịch Thương',
    status: 'Đang ra',
    genres: 'Hành động, Giả tưởng, Phiêu lưu',
    description: 'Thế giới linh võ, sức mạnh quyết định tất cả. Thiếu niên từ tiểu trấn bắt đầu hành trình chinh phục đỉnh cao võ đạo.',
  },
  {
    title: 'Thần Mộ',
    author: 'Thần Khúc',
    status: 'Hoàn thành',
    genres: 'Hành động, Giả tưởng, Siêu nhiên',
    description: 'Nghĩa địa thần linh và anh hùng, nơi chôn cất vô số bí mật từ thượng cổ. Một thanh niên phục sinh từ mộ cổ.',
  },
  {
    title: 'Hoàn Mỹ Thế Giới',
    author: 'Thần Đông',
    status: 'Hoàn thành',
    genres: 'Hành động, Giả tưởng, Phiêu lưu',
    description: 'Trong thời đại hỗn loạn, vô số chủng tộc cạnh tranh. Một thiếu niên bước ra từ đại hoang, bắt đầu hành trình huyền thoại.',
  },
  {
    title: 'Ngạo Thế Cửu Trùng Thiên',
    author: 'Phong Lăng Thiên Hạ',
    status: 'Hoàn thành',
    genres: 'Hành động, Giả tưởng, Võ thuật',
    description: 'Cửu trùng thiên cao vạn trượng, nơi đó có đỉnh cao vô thượng của võ đạo. Một sát thủ trọng sinh, quyết tâm lên đến đỉnh cao.',
  },
  {
    title: 'Tu Chân Tứ Vạn Niên',
    author: 'Huyền Vũ Đệ Tử',
    status: 'Đang ra',
    genres: 'Hành động, Giả tưởng, Võ thuật',
    description: 'Bốn vạn năm tu luyện, một hành trình dài đến vô tận. Trong thế giới tu chân, ai có thể sống được bốn vạn năm?',
  },
  {
    title: 'Vũ Động Càn Khôn',
    author: 'Thiên Tằm Thổ Đậu',
    status: 'Hoàn thành',
    genres: 'Hành động, Giả tưởng, Võ thuật',
    description: 'Đại lục Thiên Huyền, nơi hội tụ vô số thiên tài. Một thiếu niên bình thường nhặt được một viên Thạch Phù bí ẩn.',
  },
  {
    title: 'Bách Luyện Thành Thần',
    author: 'Ân Hận Thất Tâm',
    status: 'Đang ra',
    genres: 'Hành động, Giả tưởng, Hài hước',
    description: 'Khi một game thủ bị hút vào thế giới game, câu chuyện vui nhộn và kịch tính bắt đầu. Luyện cấp, đánh boss, tán gái!',
  },
  {
    title: 'Tinh Thần Biến',
    author: 'Đường Gia Tam Thiếu',
    status: 'Hoàn thành',
    genres: 'Hành động, Khoa học viễn tưởng, Phiêu lưu',
    description: 'Trong tương lai, con người chinh phục vũ trụ. Cậu thiếu niên với tinh thần biến dị, bước vào học viện anh hùng.',
  },
  {
    title: 'Võ Thần Chúa Tể',
    author: 'Bạo Tẩu Đại Bạch Thái',
    status: 'Đang ra',
    genres: 'Hành động, Giả tưởng, Võ thuật',
    description: 'Võ đạo đỉnh phong, vạn pháp qui tông. Thiếu niên mang theo hệ thống bí ẩn, bắt đầu con đường xưng bá đại lục.',
  },
  {
    title: 'Long Vương Truyền Thuyết',
    author: 'Đường Gia Tam Thiếu',
    status: 'Đang ra',
    genres: 'Hành động, Giả tưởng, Học đường',
    description: 'Thế giới hồn thú toàn mới, nơi con người và hồn thú cộng sinh. Cậu thiếu niên nghèo với võ hồn cỏ dại, quyết tâm trở thành mạnh nhất.',
  },
  {
    title: 'Ma Đạo Tổ Sư',
    author: 'Mặc Hương Đồng Khứu',
    status: 'Hoàn thành',
    genres: 'Hành động, Giả tưởng, Lãng mạn',
    description: 'Trọng sinh trở lại, ma đạo tổ sư quyết tâm sống một cuộc đời khác. Giang hồ phong ba, tình nghĩa trọn vẹn.',
  },
];

function toSlug(text: string): string {
  const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềấệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
  
  for (let i = 0; i < from.length; i++) {
    text = text.replace(new RegExp(from[i], 'gi'), to[i]);
  }
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function copyFile(source: string, dest: string) {
  try {
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.copyFile(source, dest);
  } catch (error) {
    console.error(`Error copying ${source} to ${dest}:`, error);
  }
}

async function seedStories() {
  console.log('🌱 Starting database seeding...\n');

  // Source files
  const sourceThumbnail = path.resolve(__dirname, '../public/uploads/stories/truyen-so-10_thumbnail.jfif');
  const sourceChapterPages = Array.from({ length: 19 }, (_, i) => 
    path.resolve(__dirname, `../public/uploads/stories/truyen-so-10_chapters_1123_page_${i + 1}.blob`)
  );

  let successCount = 0;
  let errorCount = 0;

  for (const data of storyData) {
    try {
      const slug = toSlug(data.title);
      
      // Check if story already exists - skip if it does
      const existing = db.prepare('SELECT id FROM stories WHERE slug = ?').get(slug);
      if (existing) {
        console.log(`⏭️  Skipping "${data.title}" (already exists)`);
        continue;
      }
      
      // Copy thumbnail
      const thumbnailDest = path.resolve(__dirname, `../public/uploads/stories/${slug}_thumbnail.jfif`);
      await copyFile(sourceThumbnail, thumbnailDest);
      const thumbnailUrl = `/uploads/stories/${slug}_thumbnail.jfif`;

      // Insert story
      const storyInsert = db.prepare(`
        INSERT INTO stories (slug, title, author, status, genres, description, thumbnail_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const storyResult = storyInsert.run(
        slug,
        data.title,
        data.author,
        data.status,
        data.genres,
        data.description,
        thumbnailUrl,
        new Date().toISOString()
      );

      // Insert chapter 1
      const chapterInsert = db.prepare(`
        INSERT INTO chapters (story_slug, chapter_number, created_at)
        VALUES (?, ?, ?)
      `);
      
      const chapterResult = chapterInsert.run(
        slug,
        1,
        new Date().toISOString()
      );
      
      const chapterId = chapterResult.lastInsertRowid;

      // Copy and insert chapter pages
      const pageInsert = db.prepare(`
        INSERT INTO chapter_pages (chapter_id, image_url, page_number)
        VALUES (?, ?, ?)
      `);

      for (let i = 0; i < sourceChapterPages.length; i++) {
        const pageDest = path.resolve(__dirname, `../public/uploads/stories/${slug}_chapters_1_page_${i + 1}.blob`);
        await copyFile(sourceChapterPages[i], pageDest);
        
        const imageUrl = `/uploads/stories/${slug}_chapters_1_page_${i + 1}.blob`;
        pageInsert.run(chapterId, imageUrl, i + 1);
      }

      console.log(`✅ Seeded "${data.title}" with 1 chapter (19 pages)`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error seeding "${data.title}":`, error);
      errorCount++;
    }
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   ✅ Success: ${successCount} stories`);
  console.log(`   ❌ Errors: ${errorCount} stories`);
}

// Run seeding
seedStories()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
