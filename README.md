# Job Board API

A simple REST API for managing job posts with authentication.

## Setup
1. Clone repo
2. Run `npm install`
3. Set up `.env` file with:
PORT=5001
DATABASE_URL=postgresql://postgres:MananamamamiaOMG@db.gmfybqdburbigdwtumkd.supabase.co:5432/postgres
JWT_SECRET=keymadebyme_isasecret
JWT_EXPIRES_IN=1d
4. Run migrations/SQL script for `users` and `jobs` tables
5. Start server: `npm start`

## Routes
### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Jobs (protected)
- GET `/api/jobs`
- POST `/api/jobs`
- PUT `/api/jobs/:id`
- DELETE `/api/jobs/:id`