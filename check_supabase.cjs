const { createClient } = require('./node_modules/@supabase/supabase-js');

const SUPABASE_URL = 'https://uqqhsuoudhksqjlnctpi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcWhzdW91ZGhrc3FqbG5jdHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMjg1MTUsImV4cCI6MjEwNDcwNDUxNX0.yez2ouCI-VCWJj1LdPKmYGAZyqV47UmIwVV9ryKGirg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkData() {
  const tables = [
    'divisions',
    'districts',
    'talukas',
    'users',
    'member_profiles',
    'role_applications',
    'cabinet_members',
    'announcements',
    'leadership_messages',
    'working_goals',
    'media_items'
  ];

  console.log('--- SUPABASE LIVE DATABASE RECORD COUNTS ---');
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.log(`Table '${table}': ERROR (${error.message})`);
      } else {
        console.log(`Table '${table}': ${data.length} records`);
      }
    } catch (err) {
      console.log(`Table '${table}': Exception (${err.message})`);
    }
  }
}

checkData();
