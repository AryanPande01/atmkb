# Deployment Guide

This guide provides instructions for deploying the E-Summit 2026 App to various platforms.

## Prerequisites

- Node.js 18+ installed
- Firebase project configured
- Environment variables set up

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase credentials
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

## Production Build

To create a production build:

```bash
npm run build:production
```

The optimized build will be in the `dist/` directory.

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides the easiest deployment option with automatic HTTPS and CDN.

**Steps:**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all variables from `.env.example`

**Or use Vercel Dashboard:**

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Add environment variables in project settings
4. Deploy automatically on every push to main branch

### 2. Netlify

**Steps:**

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Add environment variables in Netlify dashboard:
   - Go to Site Settings > Environment Variables
   - Add all variables from `.env.example`

**Or use Netlify Dashboard:**

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder
3. Add environment variables in site settings

### 3. Firebase Hosting

**Steps:**

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   - Select existing project: `e-summit-2026-app`
   - Public directory: `dist`
   - Configure as single-page app: Yes
   - Set up automatic builds: No

4. Build and deploy:
   ```bash
   npm run build:production
   firebase deploy --only hosting
   ```

### 4. Docker Deployment

**Build Docker image:**
```bash
docker build -t esummit-app .
```

**Run container:**
```bash
docker run -p 80:80 esummit-app
```

**Push to Docker Hub:**
```bash
docker tag esummit-app yourusername/esummit-app
docker push yourusername/esummit-app
```

### 5. Traditional Server (Nginx/Apache)

**Steps:**

1. Build the app:
   ```bash
   npm run build:production
   ```

2. Copy `dist/` folder to your server:
   ```bash
   scp -r dist/* user@your-server:/var/www/html/
   ```

3. Configure your web server to serve the files:
   - Use the provided `nginx.conf` for Nginx
   - Ensure React Router is configured correctly

## Environment Variables

**Important:** Never commit `.env.local` or `.env.production` to version control!

Set these environment variables in your deployment platform:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Firebase Security Rules

Make sure your Firebase Firestore security rules are set up correctly:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User collection
    match /user/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build:production
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
          VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Troubleshooting

### Build Errors

- **Missing environment variables:** Check all variables are set in your deployment platform
- **Build size too large:** Consider code splitting and lazy loading
- **Module not found:** Ensure all dependencies are in `package.json`

### Runtime Errors

- **Firebase connection issues:** Verify API keys and security rules
- **QR scanner not working:** Check HTTPS is enabled (required for camera access)
- **Authentication failing:** Verify Firebase auth configuration

## Performance Optimization

The app is already optimized with:
- Code splitting (vendor, firebase, qrcode chunks)
- Minification with Terser
- Gzip compression
- Static asset caching
- Long polling for Firestore

## Support

For issues or questions, please contact the development team.

