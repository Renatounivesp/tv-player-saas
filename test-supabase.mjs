import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpzvoxuvjsoxkhaqnska.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwenZveHV2anNveGtoYXFuc2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzE4NDgsImV4cCI6MjA5NTE0Nzg0OH0.ReBuhKdH-pvdnZUgjQdb-Xn0KDqz2mcq-ojKnWdUzRs'
)

async function test() {
  const fakeEmail = 'teste' + Date.now() + '@gmail.com'
  console.log('Testing signup with', fakeEmail)
  
  const { data, error } = await supabase.auth.signUp({
    email: fakeEmail,
    password: 'password123'
  })
  
  console.log('Data:', data)
  console.log('Error:', error)
  
  if (data.user) {
    console.log('User created successfully, cleaning up...')
    // We can't delete user from client, so we just leave it or ignore
  }
}

test()
