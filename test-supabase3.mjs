const url = 'https://lpzvoxuvjsoxkhaqnska.supabase.co/auth/v1/signup'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwenZveHV2anNveGtoYXFuc2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzE4NDgsImV4cCI6MjA5NTE0Nzg0OH0.ReBuhKdH-pvdnZUgjQdb-Xn0KDqz2mcq-ojKnWdUzRs'

async function test() {
  const fakeEmail = 'teste' + Date.now() + '@gmail.com'
  console.log('Testing raw fetch signup with', fakeEmail)
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': anonKey,
      'Authorization': 'Bearer ' + anonKey
    },
    body: JSON.stringify({
      email: fakeEmail,
      password: 'password123'
    })
  })
  
  const text = await res.text()
  console.log('Status:', res.status)
  console.log('Response:', text)
}

test()
