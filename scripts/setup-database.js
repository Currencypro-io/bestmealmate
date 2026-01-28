#!/usr/bin/env node

/**
 * Database Setup Script
 * Runs the SQL schema against Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read the schema file
const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split into individual statements (simple split - doesn't handle all edge cases)
const statements = schema
  .split(/;[\s]*\n/)
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

async function runMigration() {
  console.log('🚀 Starting database setup...\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    // Skip comments and empty statements
    if (!statement || statement.startsWith('--')) continue;

    // Extract a summary of what we're running
    const summary = statement.substring(0, 60).replace(/\n/g, ' ') + '...';

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

      if (error) {
        // Try direct query for DDL statements
        const { error: ddlError } = await supabase.from('_temp').select().limit(0);

        // If RPC doesn't work, log the statement for manual execution
        console.log(`⚠️  Statement needs manual execution: ${summary}`);
        errorCount++;
      } else {
        console.log(`✅ ${summary}`);
        successCount++;
      }
    } catch (err) {
      console.log(`⚠️  ${summary}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Results: ${successCount} succeeded, ${errorCount} need manual execution`);

  if (errorCount > 0) {
    console.log('\n⚠️  Some statements could not be executed via API.');
    console.log('Please run the SQL schema manually in Supabase SQL Editor:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy the contents of supabase/schema.sql and run it');
  }
}

runMigration().catch(console.error);
