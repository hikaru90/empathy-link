import PocketBase from 'pocketbase';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize PocketBase
const pbUrl = process.env.PUBLIC_BACKEND_URL || 'http://127.0.0.1:8090';
// Ensure URL has protocol
const pbUrlWithProtocol = pbUrl.startsWith('http') ? pbUrl : `https://${pbUrl}`;
const pb = new PocketBase(pbUrlWithProtocol);

// Initialize PostgreSQL
const connectionString = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/empathy_link';
const queryClient = postgres(connectionString);
const db = drizzle(queryClient);

// Define your PostgreSQL schema matching PocketBase collections
// You'll need to expand this based on your actual schema

const BATCH_SIZE = 100;

async function migrateCollection(collectionName, transformFn = null) {
  console.log(`\n📦 Migrating collection: ${collectionName}`);

  try {
    // Fetch all records from PocketBase
    const records = await pb.collection(collectionName).getFullList({
      sort: 'created',
    });

    console.log(`   Found ${records.length} records`);

    if (records.length === 0) {
      console.log(`   ✓ No records to migrate`);
      return { success: true, count: 0 };
    }

    // Process in batches
    let migrated = 0;
    let failed = 0;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);

      for (const record of batch) {
        try {
          console.log('record', record);
          // Transform the record if needed
          const transformedRecord = transformFn ? transformFn(record) : record;

          // Insert into PostgreSQL
          // You'll need to implement the actual insert logic based on your schema
          // Example: await db.insert(yourTable).values(transformedRecord);

          console.log(`   ✓ Migrated record ${record.id}`);
          migrated++;
        } catch (error) {
          console.error(`   ✗ Failed to migrate record ${record.id}:`, error);
          failed++;
        }
      }

      console.log(`   Progress: ${Math.min(i + BATCH_SIZE, records.length)}/${records.length}`);
    }

    console.log(`   ✓ Migration complete: ${migrated} succeeded, ${failed} failed`);
    return { success: true, migrated, failed };

  } catch (error) {
    console.error(`   ✗ Failed to migrate collection ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

async function migrateUsers() {
  console.log(`\n👥 Migrating collection: users`);

  try {
    const records = await pb.collection('users').getFullList({
      sort: 'created',
    });

    console.log(`   Found ${records.length} records`);

    if (records.length === 0) {
      console.log(`   ✓ No records to migrate`);
      return { success: true, count: 0 };
    }

    let migrated = 0;
    let failed = 0;

    for (const record of records) {
      try {
        // Migrate user WITHOUT password - they'll need to reset
        const user = {
          id: record.id,
          email: record.email,
          username: record.username || record.email.split('@')[0],
          name: record.name || record.email.split('@')[0],
          firstName: record.firstName || null,
          lastName: record.lastName || null,
          verified: record.verified || false,
          emailVerified: record.verified || false,
          image: record.avatar || null,
          emailVisibility: record.emailVisibility !== false, // Default true
          role: record.role || null,
          aiAnswerLength: record.aiAnswerLength || null,
          toneOfVoice: record.toneOfVoice || null,
          nvcKnowledge: record.nvcKnowledge || null,
          createdAt: record.created || new Date().toISOString(),
          updatedAt: record.updated || new Date().toISOString(),
        };

        await queryClient`
          INSERT INTO "user" (
            id, email, username, name, first_name, last_name, verified,
            email_verified, image, email_visibility, role, ai_answer_length,
            tone_of_voice, nvc_knowledge, created_at, updated_at
          ) VALUES (
            ${user.id}, ${user.email}, ${user.username}, ${user.name},
            ${user.firstName}, ${user.lastName}, ${user.verified},
            ${user.emailVerified}, ${user.image}, ${user.emailVisibility},
            ${user.role}, ${user.aiAnswerLength}, ${user.toneOfVoice},
            ${user.nvcKnowledge}, ${user.createdAt}, ${user.updatedAt}
          )
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            username = EXCLUDED.username,
            name = EXCLUDED.name,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            verified = EXCLUDED.verified,
            email_verified = EXCLUDED.email_verified,
            image = EXCLUDED.image,
            email_visibility = EXCLUDED.email_visibility,
            role = EXCLUDED.role,
            ai_answer_length = EXCLUDED.ai_answer_length,
            tone_of_voice = EXCLUDED.tone_of_voice,
            nvc_knowledge = EXCLUDED.nvc_knowledge,
            updated_at = EXCLUDED.updated_at
        `;

        console.log(`   ✓ Migrated user ${user.email} (password reset required)`);
        migrated++;
      } catch (error) {
        console.error(`   ✗ Failed to migrate user ${record.id}:`, error);
        failed++;
      }
    }

    console.log(`   ✓ Migration complete: ${migrated} succeeded, ${failed} failed`);
    console.log(`   ⚠️  All users will need to reset their passwords!`);
    return { success: true, migrated, failed };

  } catch (error) {
    console.error(`   ✗ Failed to migrate users:`, error.message);
    return { success: false, error: error.message };
  }
}

async function migrateMemories() {
  console.log(`\n📦 Migrating collection: user_memories -> memories`);

  try {
    const records = await pb.collection('user_memories').getFullList({
      sort: 'created',
    });

    console.log(`   Found ${records.length} records`);

    if (records.length === 0) {
      console.log(`   ✓ No records to migrate`);
      return { success: true, count: 0 };
    }

    let migrated = 0;
    let failed = 0;

    for (const record of records) {
      try {
        // Transform PocketBase memory to PostgreSQL format
        const memory = {
          userId: record.user,
          confidence: record.confidence || 'medium',
          type: record.type || 'episodic',
          priority: parseFloat(record.priority) || 1.0,
          key: record.key || null,
          value: record.value || record.memory || '',
          embedding: record.embedding ? JSON.stringify(record.embedding) : null,
          chatId: record.chat || null,
          relevanceScore: parseFloat(record.relevanceScore || record.relevance_score) || 1.0,
          accessCount: parseInt(record.accessCount || record.access_count) || 0,
          lastAccessed: record.lastAccessed || record.last_accessed || null,
          expiresAt: record.expiresAt || record.expires_at || null,
          created: record.created || new Date().toISOString(),
          updated: record.updated || new Date().toISOString(),
        };

        // Insert using raw SQL
        await queryClient`
          INSERT INTO memories (
            user_id, confidence, type, priority, key, value, embedding,
            chat_id, relevance_score, access_count, last_accessed, expires_at,
            created, updated
          ) VALUES (
            ${memory.userId}, ${memory.confidence}, ${memory.type}, ${memory.priority},
            ${memory.key}, ${memory.value}, ${memory.embedding}, ${memory.chatId},
            ${memory.relevanceScore}, ${memory.accessCount}, ${memory.lastAccessed},
            ${memory.expiresAt}, ${memory.created}, ${memory.updated}
          )
        `;

        console.log(`   ✓ Migrated memory ${record.id}`);
        migrated++;
      } catch (error) {
        if (error.code === '23503') {
          // Foreign key violation - user doesn't exist
          console.log(`   ⚠️  Skipped memory ${record.id} (user ${record.user} not found)`);
        } else {
          console.error(`   ✗ Failed to migrate memory ${record.id}:`, error.message);
        }
        failed++;
      }
    }

    console.log(`   ✓ Migration complete: ${migrated} succeeded, ${failed} failed`);
    return { success: true, migrated, failed };

  } catch (error) {
    console.error(`   ✗ Failed to migrate memories:`, error.message);
    return { success: false, error: error.message };
  }
}

async function migrateChats() {
  console.log(`\n💬 Migrating collection: chats`);

  try {
    const records = await pb.collection('chats').getFullList({
      sort: 'created',
    });

    console.log(`   Found ${records.length} records`);

    if (records.length === 0) {
      console.log(`   ✓ No records to migrate`);
      return { success: true, count: 0 };
    }

    let migrated = 0;
    let failed = 0;

    for (const record of records) {
      try {
        const chat = {
          id: record.id,
          userId: record.user,
          module: record.module || 'bullshift',
          history: record.history ? (typeof record.history === 'string' ? record.history : JSON.stringify(record.history)) : null,
          feelings: record.feelings ? (typeof record.feelings === 'string' ? record.feelings : JSON.stringify(record.feelings)) : null,
          needs: record.needs ? (typeof record.needs === 'string' ? record.needs : JSON.stringify(record.needs)) : null,
          memoryProcessed: record.memoryProcessed || record.memory_processed || false,
          analyzed: record.analyzed || false,
          analysisId: record.analysisId || record.analysis_id || null,
          pathState: record.pathState || record.path_state ? JSON.stringify(record.pathState || record.path_state) : null,
          feedbackReceived: record.feedbackReceived || record.feedback_received || false,
          feedbackReceivedAt: record.feedbackReceivedAt || record.feedback_received_at || null,
          feedbackId: record.feedbackId || record.feedback_id || null,
          created: record.created || new Date().toISOString(),
          updated: record.updated || new Date().toISOString(),
        };

        await queryClient`
          INSERT INTO chats (
            id, user_id, module, history, feelings, needs, memory_processed,
            analyzed, analysis_id, path_state, feedback_received,
            feedback_received_at, feedback_id, created, updated
          ) VALUES (
            ${chat.id}, ${chat.userId}, ${chat.module}, ${chat.history},
            ${chat.feelings}, ${chat.needs}, ${chat.memoryProcessed},
            ${chat.analyzed}, ${chat.analysisId}, ${chat.pathState},
            ${chat.feedbackReceived}, ${chat.feedbackReceivedAt},
            ${chat.feedbackId}, ${chat.created}, ${chat.updated}
          )
          ON CONFLICT (id) DO UPDATE SET
            history = EXCLUDED.history,
            feelings = EXCLUDED.feelings,
            needs = EXCLUDED.needs,
            memory_processed = EXCLUDED.memory_processed,
            analyzed = EXCLUDED.analyzed,
            analysis_id = EXCLUDED.analysis_id,
            path_state = EXCLUDED.path_state,
            feedback_received = EXCLUDED.feedback_received,
            feedback_received_at = EXCLUDED.feedback_received_at,
            feedback_id = EXCLUDED.feedback_id,
            updated = EXCLUDED.updated
        `;

        console.log(`   ✓ Migrated chat ${record.id}`);
        migrated++;
      } catch (error) {
        if (error.code === '23503') {
          // Foreign key violation - user doesn't exist
          console.log(`   ⚠️  Skipped chat ${record.id} (user ${record.user} not found)`);
        } else {
          console.error(`   ✗ Failed to migrate chat ${record.id}:`, error.message);
        }
        failed++;
      }
    }

    console.log(`   ✓ Migration complete: ${migrated} succeeded, ${failed} failed`);
    return { success: true, migrated, failed };

  } catch (error) {
    console.error(`   ✗ Failed to migrate chats:`, error.message);
    return { success: false, error: error.message };
  }
}

async function migrateAnalyses() {
  console.log(`\n📊 Migrating collection: analyses`);

  try {
    const records = await pb.collection('analyses').getFullList({
      sort: 'created',
    });

    console.log(`   Found ${records.length} records`);

    if (records.length === 0) {
      console.log(`   ✓ No records to migrate`);
      return { success: true, count: 0 };
    }

    let migrated = 0;
    let failed = 0;

    for (const record of records) {
      try {
        const analysis = {
          id: record.id,
          userId: record.user,
          chatId: record.chat || null,
          title: record.title || 'Untitled Analysis',
          observation: record.observation || null,
          feelings: record.feelings ? (typeof record.feelings === 'string' ? record.feelings : JSON.stringify(record.feelings)) : null,
          needs: record.needs ? (typeof record.needs === 'string' ? record.needs : JSON.stringify(record.needs)) : null,
          request: record.request || null,
          sentimentPolarity: record.sentiment_polarity || record.sentimentPolarity || null,
          intensityRatio: record.intensity_ratio || record.intensityRatio || null,
          emotionalBalance: record.emotional_balance || record.emotionalBalance || null,
          triggerCount: record.trigger_count || record.triggerCount || null,
          resolutionCount: record.resolution_count || record.resolutionCount || null,
          escalationRate: record.escalation_rate || record.escalationRate || null,
          empathyRate: record.empathy_rate || record.empathyRate || null,
          messageLength: record.message_length || record.messageLength || null,
          readabilityScore: record.readability_score || record.readabilityScore || null,
          emotionalShift: record.emotional_shift || record.emotionalShift || null,
          iStatementMuscle: record.i_statement_muscle || record.iStatementMuscle || null,
          clarityOfAsk: record.clarity_of_ask || record.clarityOfAsk || null,
          empathyAttempt: record.empathy_attempt || record.empathyAttempt || null,
          feelingVocabulary: record.feeling_vocabulary || record.feelingVocabulary || null,
          dailyWin: record.daily_win || record.dailyWin || null,
          created: record.created || new Date().toISOString(),
          updated: record.updated || new Date().toISOString(),
        };

        await queryClient`
          INSERT INTO analyses (
            id, user_id, chat_id, title, observation, feelings, needs, request,
            sentiment_polarity, intensity_ratio, emotional_balance, trigger_count,
            resolution_count, escalation_rate, empathy_rate, message_length,
            readability_score, emotional_shift, i_statement_muscle, clarity_of_ask,
            empathy_attempt, feeling_vocabulary, daily_win, created, updated
          ) VALUES (
            ${analysis.id}, ${analysis.userId}, ${analysis.chatId}, ${analysis.title},
            ${analysis.observation}, ${analysis.feelings}, ${analysis.needs}, ${analysis.request},
            ${analysis.sentimentPolarity}, ${analysis.intensityRatio}, ${analysis.emotionalBalance},
            ${analysis.triggerCount}, ${analysis.resolutionCount}, ${analysis.escalationRate},
            ${analysis.empathyRate}, ${analysis.messageLength}, ${analysis.readabilityScore},
            ${analysis.emotionalShift}, ${analysis.iStatementMuscle}, ${analysis.clarityOfAsk},
            ${analysis.empathyAttempt}, ${analysis.feelingVocabulary}, ${analysis.dailyWin},
            ${analysis.created}, ${analysis.updated}
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            observation = EXCLUDED.observation,
            feelings = EXCLUDED.feelings,
            needs = EXCLUDED.needs,
            request = EXCLUDED.request,
            updated = EXCLUDED.updated
        `;

        console.log(`   ✓ Migrated analysis ${record.id}`);
        migrated++;
      } catch (error) {
        if (error.code === '23503') {
          // Foreign key violation - user doesn't exist
          console.log(`   ⚠️  Skipped analysis ${record.id} (user ${record.user} not found)`);
        } else {
          console.error(`   ✗ Failed to migrate analysis ${record.id}:`, error.message);
        }
        failed++;
      }
    }

    console.log(`   ✓ Migration complete: ${migrated} succeeded, ${failed} failed`);
    return { success: true, migrated, failed };

  } catch (error) {
    console.error(`   ✗ Failed to migrate analyses:`, error.message);
    return { success: false, error: error.message };
  }
}

async function exportCollectionToJson(collectionName, outputPath) {
  console.log(`\n📝 Exporting collection: ${collectionName} to JSON`);

  try {
    const records = await pb.collection(collectionName).getFullList({
      sort: 'created',
    });

    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(records, null, 2));

    console.log(`   ✓ Exported ${records.length} records to ${outputPath}`);
    return { success: true, count: records.length };
  } catch (error) {
    console.error(`   ✗ Failed to export ${collectionName}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function listCollections() {
  console.log('\n📋 Available PocketBase collections:');
  console.log('   Note: PocketBase SDK doesn\'t provide direct collection listing.');
  console.log('   Based on your codebase, these collections exist:');

  const knownCollections = [
    'users',
    'chats',
    'user_memories',
    'traces',
    'feelings',
    'needs',
    'fights',
    'responses',
    'analyses',
    'prompts',
    'gardens',
    'user_seeds',
    'items',
    'errors',
    'chatFeedback',
    'reminders',
    'test_runs'
  ];

  for (const collection of knownCollections) {
    try {
      const count = await pb.collection(collection).getList(1, 1);
      console.log(`   • ${collection}: ~${count.totalItems} records`);
    } catch (error) {
      console.log(`   • ${collection}: (error accessing or doesn't exist)`);
    }
  }
}

// Main migration function
async function main() {
  console.log('🚀 PocketBase to PostgreSQL Migration Tool\n');

  const args = process.argv.slice(2);
  const command = args[0];

  try {
    // Authenticate with PocketBase
    if (process.env.PB_ADMIN_EMAIL && process.env.PB_ADMIN_PASSWORD) {
      console.log('🔐 Authenticating with PocketBase...');

      // Try admin auth first (for full access to all collections)
      let isAdmin = false;
      try {
        await pb.admins.authWithPassword(
          process.env.PB_ADMIN_EMAIL,
          process.env.PB_ADMIN_PASSWORD
        );
        console.log('   ✓ Authenticated as admin\n');
        isAdmin = true;
      } catch (adminError) {
        // Not an admin account, try user auth
        try {
          await pb.collection('users').authWithPassword(
            process.env.PB_ADMIN_EMAIL,
            process.env.PB_ADMIN_PASSWORD
          );
          console.log('   ✓ Authenticated as user (not admin)\n');
          console.log('   ℹ️  Note: You are using a regular user account, not an admin account.');
          console.log('   ℹ️  If you have issues accessing collections, create an admin account at:');
          console.log(`   ℹ️  ${pbUrlWithProtocol}/_/\n`);
        } catch (userError) {
          console.error('   ✗ Authentication failed for both admin and user accounts');
          console.error('   ✗ Please check your PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD in .env');
          process.exit(1);
        }
      }
    } else {
      console.log('⚠️  No authentication credentials provided.');
      console.log('   Set PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD in .env file\n');
    }

    switch (command) {
      case 'list':
        await listCollections();
        break;

      case 'export':
        const collection = args[1];
        const output = args[2] || `./${collection}.json`;
        if (!collection) {
          console.error('Usage: npm run migrate export <collection> [output-file]');
          process.exit(1);
        }
        await exportCollectionToJson(collection, output);
        break;

      case 'migrate':
        const target = args[1];

        if (!target) {
          console.error('❌ Please specify what to migrate: users, memories, chats, analyses, or all');
          process.exit(1);
        }

        // Migration order matters due to foreign key constraints
        if (target === 'all') {
          console.log('⚠️  Running migrations in order (users → chats → analyses → memories)...\n');

          const usersResult = await migrateUsers();
          const chatsResult = await migrateChats();
          const analysesResult = await migrateAnalyses();
          const memoriesResult = await migrateMemories();

          console.log('\n✅ Migration Summary:');
          console.log(`   Users:    ${usersResult.migrated || 0} migrated, ${usersResult.failed || 0} failed`);
          console.log(`   Chats:    ${chatsResult.migrated || 0} migrated, ${chatsResult.failed || 0} failed`);
          console.log(`   Analyses: ${analysesResult.migrated || 0} migrated, ${analysesResult.failed || 0} failed`);
          console.log(`   Memories: ${memoriesResult.migrated || 0} migrated, ${memoriesResult.failed || 0} failed`);
          console.log('\n   Note: Some collections like feelings, needs, errors may need custom migration logic.');
        } else {
          // Single collection migration
          if (target === 'users') {
            await migrateUsers();
          } else if (target === 'memories') {
            await migrateMemories();
          } else if (target === 'chats') {
            await migrateChats();
          } else if (target === 'analyses') {
            await migrateAnalyses();
          } else {
            console.error(`❌ Unknown migration target: ${target}`);
            console.log('   Valid targets: users, memories, chats, analyses, all');
            process.exit(1);
          }
        }
        break;

      case 'help':
      default:
        console.log('Usage:');
        console.log('  node scripts/migrate-pocketbase-to-postgres.js list');
        console.log('  node scripts/migrate-pocketbase-to-postgres.js export <collection> [output-file]');
        console.log('  node scripts/migrate-pocketbase-to-postgres.js migrate users');
        console.log('  node scripts/migrate-pocketbase-to-postgres.js migrate memories');
        console.log('  node scripts/migrate-pocketbase-to-postgres.js migrate chats');
        console.log('  node scripts/migrate-pocketbase-to-postgres.js migrate analyses');
        console.log('  node scripts/migrate-pocketbase-to-postgres.js migrate all');
        console.log('\nEnvironment variables:');
        console.log('  PUBLIC_BACKEND_URL      - PocketBase URL');
        console.log('  DATABASE_URL            - PostgreSQL connection string');
        console.log('  PB_ADMIN_EMAIL          - PocketBase admin email (optional)');
        console.log('  PB_ADMIN_PASSWORD       - PocketBase admin password (optional)');
        console.log('\n⚠️  Note: User passwords cannot be migrated. All users will need to reset passwords.');
        break;
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await queryClient.end();
    console.log('\n✅ Done');
  }
}

main();
