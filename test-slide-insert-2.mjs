import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpzvoxuvjsoxkhaqnska.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwenZveHV2anNveGtoYXFuc2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzE4NDgsImV4cCI6MjA5NTE0Nzg0OH0.ReBuhKdH-pvdnZUgjQdb-Xn0KDqz2mcq-ojKnWdUzRs'
)

async function test() {
  console.log('Logging in with test account...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'teste1779661632535@gmail.com',
    password: 'password123'
  })
  
  if (authError) return console.error('Login error:', authError)
  
  console.log('Fetching clinics...');
  const { data: clinics } = await supabase.from('clinics').select('*');
  const clinicId = clinics[0].id;
  
  console.log('Testing insert to slides with user_id...');
  const { data, error } = await supabase.from('slides').insert([{
    clinic_id: clinicId,
    type: 'text',
    text_content: 'Test Slide with user_id',
    duration_seconds: 10,
    order_index: 0,
    is_active: true,
    user_id: authData.user.id // Trying this!
  }]).select()
  
  console.log('Insert Result:', data)
  console.log('Insert Error:', error)
}
test()
