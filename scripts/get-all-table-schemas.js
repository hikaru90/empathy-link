import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function getAllSchemas() {
  console.log('🔍 Getting all PostgreSQL table schemas...\n');

  try {
    const tables = ['memories', 'chats', 'messages', 'analyses', 'feelings', 'chat_feedback', 'errors'];

    for (const tableName of tables) {
      console.log(`\n📋 Table: ${tableName}`);
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${tableName}
        ORDER BY ordinal_position
      `;

      if (columns.length === 0) {
        console.log(`  ⚠️  Table "${tableName}" does not exist`);
      } else {
        columns.forEach(c => {
          console.log(`  • ${c.column_name} (${c.data_type}) ${c.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sql.end();
  }
}

getAllSchemas();
