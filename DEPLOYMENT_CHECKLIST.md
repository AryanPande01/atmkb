# Deployment Checklist ✅

Use this checklist before deploying to production.

## Pre-Deployment

- [ ] All environment variables configured in `.env.local`
- [ ] Production build tested locally (`npm run build:production`)
- [ ] No console errors in browser dev tools
- [ ] QR scanner tested on mobile device
- [ ] Authentication flow tested (Google + Email/Password)
- [ ] Transaction flow tested end-to-end
- [ ] Firebase Security Rules configured correctly
- [ ] All dependencies installed (`npm install`)

## Firebase Setup

- [ ] Firebase project created and active
- [ ] Firestore database initialized
- [ ] Authentication enabled (Email/Password + Google)
- [ ] Security Rules deployed:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /user/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
      match /transactions/{transactionId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
  }
  ```
- [ ] Test users created (customer + stall owner)
- [ ] Authorized domains added to Firebase Console

## Platform-Specific

### Vercel
- [ ] Repository connected
- [ ] Build command: `npm run build:production`
- [ ] Output directory: `dist`
- [ ] Environment variables added in dashboard
- [ ] Custom domain configured (optional)

### Netlify
- [ ] Repository connected OR build uploaded
- [ ] Build command: `npm run build:production`
- [ ] Publish directory: `dist`
- [ ] Environment variables added
- [ ] Redirects configured for React Router

### Firebase Hosting
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Logged in (`firebase login`)
- [ ] Hosting initialized (`firebase init hosting`)
- [ ] Project ID correct: `e-summit-2026-app`
- [ ] Public directory: `dist`

### Docker
- [ ] Docker installed
- [ ] Image built successfully (`docker build -t esummit-app .`)
- [ ] Container runs without errors
- [ ] Port 80 accessible
- [ ] nginx.conf tested

## Post-Deployment

- [ ] HTTPS enabled (required for QR scanner)
- [ ] App loads on all browsers (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness checked
- [ ] Authentication works on production URL
- [ ] QR code generation works
- [ ] QR scanner opens camera
- [ ] Points transfer completes successfully
- [ ] Transaction history displays correctly
- [ ] Wallet balances update correctly
- [ ] Error handling works (no crashes)
- [ ] Loading states visible
- [ ] Analytics tracking (optional)

## Security

- [ ] No API keys hardcoded in source
- [ ] Environment variables not exposed in public files
- [ ] `.env.local` not committed to git
- [ ] Firebase API key restrictions configured
- [ ] HTTPS/SSL certificate valid
- [ ] CORS properly configured
- [ ] Rate limiting considered (if needed)

## Performance

- [ ] Build size optimized (< 1MB per chunk)
- [ ] Images optimized (if any)
- [ ] CDN configured (automatic on Vercel/Netlify)
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] Lighthouse score > 90

## Testing Checklist

- [ ] Customer can log in
- [ ] Stall owner can log in
- [ ] Customer sees 500 points in wallet
- [ ] Stall owner sees 0 points in wallet
- [ ] QR code generates correctly
- [ ] QR code is unique per stall owner
- [ ] Camera opens on "Scan QR Code" click
- [ ] QR code scans successfully
- [ ] Points transfer completes
- [ ] Customer wallet decreases
- [ ] Stall owner wallet increases
- [ ] Transaction appears in history
- [ ] Transaction has correct timestamp
- [ ] Customer name appears in transaction
- [ ] Cannot scan own QR code (error shown)
- [ ] Cannot transfer more points than available
- [ ] Logout works correctly
- [ ] Refresh doesn't lose state
- [ ] Back button works correctly

## Rollback Plan

- [ ] Previous version accessible
- [ ] Database backup available
- [ ] Rollback command ready
  ```bash
  # Vercel
  vercel rollback
  
  # Netlify
  netlify rollback
  
  # Firebase
  firebase hosting:rollback
  ```

## Documentation

- [ ] README.md updated
- [ ] QUICK_START.md provided
- [ ] DEPLOYMENT.md complete
- [ ] Environment variables documented
- [ ] Known issues documented

## Monitoring

- [ ] Error tracking configured (optional)
- [ ] Analytics set up (optional)
- [ ] Uptime monitoring enabled (optional)
- [ ] Logs accessible
- [ ] Alert system configured (optional)

## Success Criteria

✅ All tests pass
✅ No critical errors
✅ Performance acceptable
✅ Security verified
✅ Documentation complete
✅ Team notified

## Emergency Contacts

- **Development Team:** [Your contact]
- **Firebase Support:** [console.firebase.google.com/support](https://console.firebase.google.com/support)
- **Hosting Support:** [Check your platform]

---

**Ready to Deploy!** 🚀

Review all items above before going live.

