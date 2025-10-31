# Quick Start Guide

## Local Development

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd esummit
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

The `.env.local` file is already populated with the Firebase credentials. No changes needed unless you want to use different credentials.

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5174 in your browser.

## Production Deployment (Fastest)

### Deploy to Vercel (2 minutes)

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub/GitLab/Bitbucket repository

2. **Configure Project:**
   - Framework Preset: Vite
   - Build Command: `npm run build:production`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables:**
   - Go to Project Settings > Environment Variables
   - Add all variables from `.env.example`
   - Click "Deploy"

4. **Done!** Your app is live in 2 minutes.

### Deploy to Netlify (3 minutes)

1. **Drag & Drop:**
   - Build locally: `npm run build:production`
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to deploy

2. **Or Connect Git:**
   - Go to Sites > Add new site > Import from Git
   - Connect your repository
   - Build settings:
     - Build command: `npm run build:production`
     - Publish directory: `dist`

3. **Environment Variables:**
   - Site Settings > Build & Deploy > Environment
   - Add all variables from `.env.example`

4. **Deploy!**

### Deploy to Firebase Hosting (5 minutes)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select existing project: e-summit-2026-app)
firebase init hosting

# Build and Deploy
npm run build:production
firebase deploy --only hosting
```

## Testing the Production Build Locally

```bash
# Build
npm run build:production

# Preview
npm run preview
```

## Authentication Setup

### For Customers
- Login with Google (must use @iiitn.ac.in email)
- OR use email that starts with `customer@`

### For Stall Owners
- Login with email that starts with `stall@`

## Features

✅ **Customer Features:**
- Initial wallet: 500 points
- Scan QR codes to pay
- Send points to stalls

✅ **Stall Owner Features:**
- Initial wallet: 0 points
- Generate unique QR code
- View transaction history
- Receive points from customers

## Troubleshooting

**QR Scanner not working?**
- Make sure you're on HTTPS
- Grant camera permissions

**Firebase errors?**
- Check environment variables are set
- Verify Firebase project is active

**Build errors?**
- Run `npm ci` to clean install
- Check Node.js version (18+)

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

