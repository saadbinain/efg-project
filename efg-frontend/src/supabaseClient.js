import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rxufyopyzvhggttlcfvo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dWZ5b3B5enZoZ2d0dGxjZnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzM2MjMsImV4cCI6MjA5Njg0OTYyM30.uLRBmV20WtQyfBpg5eN4JYxReo-8690m828iaJPs2iU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)