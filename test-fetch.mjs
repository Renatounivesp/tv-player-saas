import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lpzvoxuvjsoxkhaqnska.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwenZveHV2anNveGtoYXFuc2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzE4NDgsImV4cCI6MjA5NTE0Nzg0OH0.ReBuhKdH-pvdnZUgjQdb-Xn0KDqz2mcq-ojKnWdUzRs'
)

async function test() {
  console.log('Fetching clinics...')
  const c = await supabase.from('clinics').select('*')
  console.log('Clinics:', c)
  
  console.log('Fetching plans...')
  const p = await supabase.from('plans').select('*')
  console.log('Plans:', p)
}

test()
