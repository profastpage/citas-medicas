// Direct Supabase Auth test — bypass our app to see raw Supabase error
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('URL:', SUPABASE_URL);
console.log('Anon key (first 30 chars):', ANON_KEY?.substring(0, 30));
console.log('');

const supabase = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const email = `direct-test+${Date.now()}@gmail.com`;
  console.log('Attempting signUp for:', email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'TestPassword123!',
    options: {
      data: {
        full_name: 'Direct Test',
        phone: '+51 999 999 999',
      },
    },
  });

  console.log('\n=== RESULT ===');
  console.log('Error:', error);
  console.log('Error type:', typeof error);
  console.log('Error JSON:', JSON.stringify(error, null, 2));
  console.log('');
  console.log('Data user:', data?.user ? {
    id: data.user.id,
    email: data.user.email,
    aud: data.user.aud,
    confirmed: data.user.email_confirmed_at || data.user.confirmed_at,
  } : null);
  console.log('Data session:', data?.session ? 'present' : 'null');
  console.log('Data identities count:', data?.user?.identities?.length ?? 'none');
}

main().catch((e) => {
  console.error('💥', e);
  process.exit(1);
});
