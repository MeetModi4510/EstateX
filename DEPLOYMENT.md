# EstateX Deployment Guide

EstateX is a full-stack application composed of a Vite/React Frontend and a Node.js/Express Backend, integrated with MongoDB Atlas and Cloudinary. This guide details how to confidently deploy EstateX into a production environment.

## 1. Prerequisites
- A **MongoDB Atlas** Cluster (Database)
- A **Cloudinary** Account (Image hosting)
- A Frontend hosting provider (e.g. Vercel, Netlify)
- A Backend hosting provider (e.g. Render, Heroku, AWS)
- A custom domain (e.g. `estatex.in`)

## 2. Environment Variables Setup

### Backend (.env)
Your backend deployment needs the following configuration secrets set in its environment:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/estatex?retryWrites=true&w=majority
JWT_SECRET=a_very_secure_long_random_string
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://www.estatex.in
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
> **CAUTION:** Never commit your production `.env` to version control. Do not use your development database connection string for production.

### Frontend (.env)
The frontend requires only public-facing keys. Ensure this is configured in your Vercel/Netlify dashboard.
```env
VITE_API_URL=https://api.estatex.in/api
```

## 3. Database Preparation & Safety
- **Indexes:** Ensure your MongoDB collections are appropriately indexed (e.g., `status`, `city`, `price` on Properties, `email` on Users).
- **Backups:** Enable continuous backups in MongoDB Atlas before production launch.
- **Seeding:** Do NOT run `npm run seed` in production as it executes `db.dropDatabase()`.

## 4. Deploying the Backend
1. **Build Step:** Configure your hosting provider to run `npm run build` inside the `server/` directory.
2. **Start Command:** Configure your service to start with `npm run start` (which maps to `node dist/server.js`).
3. **Health Check:** Once deployed, verify it's running by pinging `https://api.estatex.in/api/health`. You should receive `{"status":"ok"}`.

## 5. Deploying the Frontend
1. **Build Step:** Configure Vercel/Netlify to run `npm run build` in the root directory.
2. **Output Directory:** Set the output/publish directory to `dist/`.
3. **Routing:** Ensure your hosting provider handles Single Page Application (SPA) routing (e.g., in Vercel, all unhandled routes redirect to `index.html`).

## 6. Security Features in Production
- **CORS:** Only `FRONTEND_URL` is allowed to communicate with the backend.
- **Rate Limiting:** The backend enforces 100 requests / 15 minutes globally, and limits auth attempts strictly to prevent brute-force attacks.
- **Headers:** Helmet secures HTTP headers by default.
- **Error Handling:** Stack traces are masked in production, ensuring system internals are never leaked to clients.

## 7. Post-Deployment Smoke Test
1. Visit `https://www.estatex.in`.
2. Ensure properties are loading.
3. Test a lead submission form.
4. Login as an Admin via `/admin/login` and verify backend connectivity and rate-limits.
