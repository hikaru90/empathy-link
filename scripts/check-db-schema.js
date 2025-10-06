import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function checkSchema() {
  console.log('🔍 Checking PostgreSQL schema...\n');

  try {
    // List all tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    console.log('📋 Tables:');
    tables.forEach(t => console.log(`  • ${t.table_name}`));

    // Get columns for 'user' table
    console.log('\n👤 Columns in "user" table:');
    const userColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'user'
      ORDER BY ordinal_position
    `;

    if (userColumns.length === 0) {
      console.log('  ⚠️  Table "user" does not exist');
    } else {
      userColumns.forEach(c => {
        console.log(`  • ${c.column_name} (${c.data_type}) ${c.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

checkSchema();
