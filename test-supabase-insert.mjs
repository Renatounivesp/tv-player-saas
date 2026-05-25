import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpzvoxuvjsoxkhaqnska.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwenZveHV2anNveGtoYXFuc2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzE4NDgsImV4cCI6MjA5NTE0Nzg0OH0.ReBuhKdH-pvdnZUgjQdb-Xn0KDqz2mcq-ojKnWdUzRs'
)

async function test() {
  const fakeEmail = 'teste' + Date.now() + '@gmail.com'
  console.log('Testing signup...')
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: fakeEmail,
    password: 'password123'
  })
  
  if (authError) {
    console.error('Signup error:', authError)
    return
  }
  
  console.log('Testing insert to clinics...')
  const { data, error } = await supabase.from('clinics').insert([{
    name: 'Teste Clinic',
    slug: 'teste-clinic-' + Date.now(),
    manager_name: 'Manager',
    email: fakeEmail,
    status: 'active',
    plan_id: 'p_unico',
    subscription_value: 49,
    user_id: authData.user.id
  }]).select()
  
  console.log('Insert Result:', data)
  console.log('Insert Error:', error)
}
test()
