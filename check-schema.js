const Database = require('better-sqlite3');
const db = new Database('./local.sqlite');

console.log('\n📋 Tables in database:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
tables.forEach(t => console.log(`  - ${t.name}`));

console.log('\n📋 Stories table schema:');
const storiesSchema = db.prepare("PRAGMA table_info(stories)").all();
storiesSchema.forEach(col => console.log(`  - ${col.name} (${col.type})`));

console.log('\n📋 Chapters table schema:');
const chaptersSchema = db.prepare("PRAGMA table_info(chapters)").all();
chaptersSchema.forEach(col => console.log(`  - ${col.name} (${col.type})`));

console.log('\n📋 Chapter pages table:');
const chapterPagesQuery = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%chapter%page%'").all();
chapterPagesQuery.forEach(t => {
  console.log(`  Table: ${t.name}`);
  const schema = db.prepare(`PRAGMA table_info(${t.name})`).all();
  schema.forEach(col => console.log(`    - ${col.name} (${col.type})`));
});

db.close();
