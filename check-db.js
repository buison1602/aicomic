const Database = require('better-sqlite3');

const db = new Database('./local.sqlite');

console.log('\n📊 Stories in local.sqlite:');
console.log('='.repeat(80));

const stories = db.prepare('SELECT * FROM stories').all();

if (stories.length === 0) {
  console.log('❌ No stories found in database');
} else {
  stories.forEach((story, index) => {
    console.log(`\n${index + 1}. ${story.title}`);
    console.log(`   Slug: ${story.slug}`);
    console.log(`   Author: ${story.author}`);
    console.log(`   Thumbnail URL: ${story.thumbnail_url}`);
    console.log(`   Created: ${story.created_at}`);
  });
}

console.log('\n' + '='.repeat(80));
console.log(`Total: ${stories.length} stories\n`);

db.close();
