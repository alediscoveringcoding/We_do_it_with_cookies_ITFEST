# PathFinder Deployment Guide

## Frontend Deployment (Vercel)

1. **Push Frontend to GitHub**
   ```bash
   git add .
   git commit -m "Complete PathFinder application"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure settings:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Add Environment Variables in Vercel**
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=your_backend_url
   ```

## Backend Deployment (Render)

1. **Push Backend to Separate Repository**
   ```bash
   # Create new repo for backend
   mkdir pathfinder-server
   cp -r server/* pathfinder-server/
   cd pathfinder-server
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin <your-backend-repo-url>
   git push origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your backend repository
   - Configure settings:
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`

3. **Add Environment Variables in Render**
   ```
   OPENAI_API_KEY=your_openai_api_key
   FRONTEND_URL=your_vercel_url
   PORT=3000
   ```

## Supabase Configuration

1. **Update URL Configuration**
   - Go to Supabase Dashboard → Project → Authentication → URL Configuration
   - Add your Vercel domain to:
     - Site URL: `https://your-domain.vercel.app`
     - Redirect URLs: `https://your-domain.vercel.app/**`

2. **Enable Google OAuth**
   - Go to Authentication → Providers
   - Enable Google provider
   - Add Google Client ID and Secret from Google Cloud Console

3. **Run Database Schema**
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `src/db/schema.sql`
   - Run the schema to create all tables

4. **Seed the Database**
   - Open browser console on your deployed site
   - Run: `import('./src/data/seedData.js').then(m => m.runSeed())`

## Final Steps

1. **Update Frontend API URL**
   - Go to Vercel dashboard
   - Update `VITE_API_URL` to point to your Render backend URL
   - Redeploy the frontend

2. **Test the Application**
   - Verify all pages load correctly
   - Test authentication flow
   - Test assessment functionality
   - Test Q&A with AI responses

## Environment Files Setup

### Frontend (.env)
```bash
cp .env.example .env
# Fill in your values:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000  # or your deployed backend URL
```

### Backend (server/.env)
```bash
cp server/.env.example server/.env
# Fill in your values:
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:5173  # or your deployed frontend URL
PORT=3000
```

## Local Development

1. **Install Dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd server
   npm install
   ```

2. **Start Development Servers**
   ```bash
   # Backend (in server directory)
   npm run dev
   
   # Frontend (in root directory)
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend .env matches your frontend URL
   - Check that your Vercel domain is added to Supabase URL Configuration

2. **Authentication Issues**
   - Verify Supabase URL and keys are correct
   - Check that redirect URLs are properly configured in Supabase

3. **AI Responses Not Working**
   - Verify OpenAI API key is valid and has credits
   - Check backend logs for API errors

4. **Database Issues**
   - Ensure schema was run correctly in Supabase
   - Verify RLS policies are in place
   - Run seed data if tables are empty

### Getting Help

- Check browser console for JavaScript errors
- Check Supabase logs for database issues
- Check Render logs for backend errors
- Check Vercel logs for frontend deployment issues

## Production Considerations

1. **Security**
   - Never expose API keys in frontend code
   - Use environment variables for all sensitive data
   - Enable RLS policies in Supabase

2. **Performance**
   - Monitor API usage and costs
   - Implement caching where appropriate
   - Use CDN for static assets

3. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor API response times
   - Track user analytics

4. **Scaling**
   - Consider database connection pooling
   - Implement rate limiting on API endpoints
   - Plan for horizontal scaling if needed
