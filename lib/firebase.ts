import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Guard against missing API key during SSR/build-time prerendering — getAuth() throws
// auth/invalid-api-key when the key is absent, which kills the Next.js build worker.
let auth: Auth;

if (firebaseConfig.apiKey) {
  const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
} else {
  // Return a proxy or a more robust mock if auth is not initialized,
  // but preferably it should be handled by the provider.
  auth = {
    onAuthStateChanged: (cb: any) => {
      console.warn('Firebase Auth not initialized: Missing API Key');
      cb(null);
      return () => {};
    },
    signOut: async () => {},
  } as unknown as Auth;
}

export { auth };
