import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const ensureFirebaseApp = () => {
	if (!firebaseConfig.apiKey) {
		throw new Error('Firebase config is missing. Add EXPO_PUBLIC_FIREBASE_* env vars.');
	}

	if (getApps().length) return getApp();
	return initializeApp(firebaseConfig);
};

export const getFirebaseAuth = () => {
	const app = ensureFirebaseApp();
	try {
		return getAuth(app);
	} catch (e) {
		return initializeAuth(app, {
			persistence: getReactNativePersistence(AsyncStorage),
		});
	}
};
