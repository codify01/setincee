import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAhVlKbM1jdY-lVoRK_juGR748LE_p1nzU",
  authDomain: "bryze-21606.firebaseapp.com",
  projectId: "bryze-21606",
  storageBucket: "bryze-21606.firebasestorage.app",
  messagingSenderId: "808342927384",
  appId: "1:808342927384:web:d6f58b236bbb4fd02aeb6d",
  measurementId: "G-KDQSFYTCVR"
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
