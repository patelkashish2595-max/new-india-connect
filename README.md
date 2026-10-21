# New India Connect — Frontend + Node.js Backend + Admin Panel

## Requirements
- Node.js 20+ installed (Node 24 is okay)
- No PostgreSQL, Visual Studio C++ Build Tools, or native database driver required.

## First-time setup (Windows)
1. Extract this ZIP to a folder.
2. Open CMD in the extracted folder.
3. Run `npm install` (requires internet for npm packages).
4. Copy `server\.env.example` to `server\.env`.
5. Open `server\.env` and set a strong `ADMIN_PASSWORD` and a random `SESSION_SECRET` (32+ characters). Keep these private.

## Start
Open two CMD windows in the project folder:
- Window 1: `npm run dev:server`
- Window 2: `npm run dev`
Then open http://localhost:5173.

## Admin
Click **Admin login** under the login/signup section or open http://localhost:5173/admin. Use the ADMIN_USERNAME and ADMIN_PASSWORD from `server\.env`. Admin dashboard supports overview stats, user suspend/unsuspend/delete, post removal, report review/dismissal and activity logs.

## Data
The backend writes data to `server/data/db.json`. This simple file-backed store is for local development/demo, not production or multi-server use. Back up this file. For production, use a managed database, HTTPS, secure session storage, backups, rate limiting and proper privacy/security review.

## Notes
- Existing social frontend retained. Core auth, posts, likes, comments, reports, stories, saves and admin moderation APIs are wired to this backend. Some advanced features from the original UI (such as real-time messaging, two-factor authentication, email verification and production media storage) need further implementation.
- Admin login is separate from member login.
