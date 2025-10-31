# E-Summit 2026 App 🎪

A modern point-of-sale application for E-Summit 2026, featuring QR code-based transactions between customers and stall owners.

## 🌟 Features

### Customer Features
- 💰 **Initial Wallet:** 500 points on signup
- 📱 **QR Code Scanner:** Scan stall QR codes to make purchases
- 💳 **Point Transactions:** Seamlessly transfer points to stalls
- 🔐 **Secure Authentication:** Google Sign-In or Email/Password

### Stall Owner Features
- 🎯 **Unique QR Codes:** Generate your own payment QR code
- 📊 **Transaction History:** View all customer transactions in real-time
- 💵 **Wallet Management:** Track incoming points automatically
- 🏪 **Dashboard:** Beautiful interface for managing your stall

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) in your browser.

### Production Build

```bash
# Create optimized production build
npm run build:production

# Preview production build
npm run preview
```

## 📦 Deployment

This app is production-ready and can be deployed to:

- ✅ **Vercel** (Recommended - 2 minutes)
- ✅ **Netlify** (3 minutes)
- ✅ **Firebase Hosting** (5 minutes)
- ✅ **Docker** (Self-hosted)
- ✅ **Traditional Servers** (Nginx/Apache)

See [QUICK_START.md](./QUICK_START.md) for rapid deployment or [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔧 Technology Stack

- **Frontend:** React 19, Vite 7
- **Authentication:** Firebase Auth
- **Database:** Cloud Firestore
- **QR Code Generation:** qrcode.react
- **QR Scanner:** html5-qrcode
- **Styling:** Inline CSS with modern design

## 📁 Project Structure

```
esummit/
├── src/
│   ├── components/
│   │   ├── Login.jsx       # Authentication component
│   │   ├── UserPage.jsx    # Customer dashboard
│   │   └── StallPage.jsx   # Stall owner dashboard
│   ├── App.jsx             # Main app component
│   ├── firebase.js         # Firebase configuration
│   └── main.jsx            # Entry point
├── .env.example            # Environment variables template
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies

```

## 🔐 Authentication Setup

### Customer Login
- **Google Sign-In:** Must use @iiitn.ac.in email
- **Email/Password:** Email must start with `customer@`

### Stall Owner Login
- **Email/Password:** Email must start with `stall@`

Example credentials:
- Customer: `customer1@example.com` / `password123`
- Stall Owner: `stall1@example.com` / `password123`

## 🌐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

⚠️ **Never commit `.env.local` to version control!**

## 📝 Firebase Firestore Structure

### Collections

**users**
```javascript
{
  uid: string,
  email: string,
  role: 'customer' | 'store',
  wallet: number,
  Username: string,
  photo: string,
  lastLogin: timestamp
}
```

**transactions**
```javascript
{
  stallOwnerId: string,
  customerId: string,
  customerName: string,
  customerEmail: string,
  points: number,
  timestamp: timestamp
}
```

## 🔒 Security Rules

Make sure to configure Firebase Security Rules:

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

## 📱 Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build:production

# Lint code
npm run lint

# Preview production build
npm run preview
```

## 📄 License

This project is proprietary software for E-Summit 2026.

## 🤝 Contributing

This is a private project. Contact the development team for contributions.

## 📞 Support

For issues or questions:
- Check [QUICK_START.md](./QUICK_START.md)
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Contact the development team

---

Built with ❤️ for E-Summit 2026
