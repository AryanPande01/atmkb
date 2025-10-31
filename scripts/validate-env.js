#!/usr/bin/env node
// Validate required VITE_ env vars at build time
const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('Missing required environment variables: ' + missing.join(', '));
  process.exit(1);
}
console.log('All required environment variables are present.');
