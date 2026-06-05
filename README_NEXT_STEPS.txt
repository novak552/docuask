Docu.ask Supabase Auth patch

Copy these files into your GitHub repository:

1. src/App.jsx
   Replace your existing App.jsx with this file.

2. src/supabaseClient.js
   Add this new file next to App.jsx.

3. api/chat.js
   Add/replace this Vercel serverless function. If your current chat.js is in the project root, move it to api/chat.js.

4. package.json
   Replace or update dependencies to include @supabase/supabase-js.

Required Vercel environment variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY

Required Supabase Auth settings:
Authentication > URL Configuration
- Site URL: https://docuask-one.vercel.app
- Redirect URLs:
  https://docuask-one.vercel.app/**
  http://localhost:5173/**
