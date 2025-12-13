const Database = require('better-sqlite3');
const db = new Database('./local.sqlite');

try {
  console.log('🔧 Adding creatorId column to stories table...');
  
  // Add creatorId column
  db.exec(`
    ALTER TABLE stories ADD COLUMN creator_id TEXT REFERENCES users(id) ON DELETE CASCADE;
  `);
  
  console.log('✅ Successfully added creatorId column!');
  console.log('ℹ️  Note: Existing stories will have NULL creatorId');
  
} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('ℹ️  Column creatorId already exists, skipping...');
  } else {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
} finally {
  db.close();
}
