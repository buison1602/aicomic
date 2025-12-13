const Database = require('better-sqlite3');
const db = new Database('./local.sqlite');

// Create users table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY NOT NULL,
    name text,
    email text NOT NULL UNIQUE,
    email_verified integer,
    image text
  )
`).run();
console.log('✅ Users table created');

// Create accounts table
db.prepare(`
  CREATE TABLE IF NOT EXISTS accounts (
    user_id text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    provider_account_id text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    PRIMARY KEY(provider, provider_account_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();
console.log('✅ Accounts table created');

// Create sessions table
db.prepare(`
  CREATE TABLE IF NOT EXISTS sessions (
    session_token text PRIMARY KEY NOT NULL,
    user_id text NOT NULL,
    expires integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();
console.log('✅ Sessions table created');

// Create verification_tokens table
db.prepare(`
  CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires integer NOT NULL,
    PRIMARY KEY(identifier, token)
  )
`).run();
console.log('✅ Verification tokens table created');

console.log('\n🎉 All auth tables created successfully!');

db.close();
