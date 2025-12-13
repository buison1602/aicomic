const Database = require('better-sqlite3');
const db = new Database('./local.sqlite');

console.log('\n📊 Stories with chapter count:');
console.log('='.repeat(80));

const stories = db.prepare(`
  SELECT 
    s.id,
    s.slug,
    s.title,
    COUNT(c.id) as chapter_count
  FROM stories s
  LEFT JOIN chapters c ON s.slug = c.story_slug
  GROUP BY s.id
  ORDER BY s.created_at DESC
`).all();

stories.forEach((story, index) => {
  console.log(`\n${index + 1}. ${story.title}`);
  console.log(`   Slug: ${story.slug}`);
  console.log(`   Chapters: ${story.chapter_count}`);
});

console.log('\n' + '='.repeat(80));
console.log(`Total: ${stories.length} stories`);
console.log(`Stories with chapters: ${stories.filter(s => s.chapter_count > 0).length}`);
console.log(`Stories without chapters: ${stories.filter(s => s.chapter_count === 0).length}\n`);

db.close();
