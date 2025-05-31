
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gdzpwlcmfudewgowmzbm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkenB3bGNtZnVkZXdnb3dtemJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MjY3OTgsImV4cCI6MjA1OTUwMjc5OH0.qsyoAMCjPNPhnjnD97oSoHK6YIQh-QjPWnoxw35FIm4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
