import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpzvoxuvjsoxkhaqnska.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwenZveHV2anNveGtoYXFuc2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzE4NDgsImV4cCI6MjA5NTE0Nzg0OH0.ReBuhKdH-pvdnZUgjQdb-Xn0KDqz2mcq-ojKnWdUzRs'
)

async function test() {
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'teste1779661632535@gmail.com',
    password: 'password123'
  })
  
  const { data: clinics } = await supabase.from('clinics').select('*');
  const clinicId = clinics[0].id;
  
  console.log('Testing update to clinic:', clinicId);
  const { data, error } = await supabase.from('clinics').update({ status: 'active' }).eq('id', clinicId).select()
  
  console.log('Update Result:', data)
  console.log('Update Error:', error)
}
test()
