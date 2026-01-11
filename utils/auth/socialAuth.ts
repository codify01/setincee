import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { getFirebaseAuth } from '../firebaseClient';
import {
	GoogleAuthProvider,
	OAuthProvider,
	signInWithCredential,
	User,
} from 'firebase/auth';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
	authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
};

const getGoogleClientId = () =>
	Constants.expoConfig?.extra?.googleClientId ||
	process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
	process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
	process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

const makeRedirectUri = () =>
	AuthSession.makeRedirectUri({
		useProxy: true,
	});

export const signInWithGoogle = async (): Promise<{ user: User; idToken: string }> => {
	const clientId = getGoogleClientId();
	if (!clientId) {
		throw new Error('Missing Google client ID (set EXPO_PUBLIC_GOOGLE_*).');
	}

	const redirectUri = makeRedirectUri();
	const authUrl =
		`${discovery.authorizationEndpoint}?client_id=${clientId}` +
		`&redirect_uri=${encodeURIComponent(redirectUri)}` +
		`&response_type=token&scope=profile%20email`;

	const result = await AuthSession.startAsync({ authUrl }) as AuthSession.AuthSessionResult & {
		params?: { access_token?: string };
	};

	if (result.type !== 'success' || !result.params?.access_token) {
		throw new Error('Google sign-in was cancelled.');
	}

	const auth = getFirebaseAuth();
	const credential = GoogleAuthProvider.credential(undefined, result.params.access_token);
	const userCredential = await signInWithCredential(auth, credential);
	const idToken = await userCredential.user.getIdToken();

	return { user: userCredential.user, idToken };
};

export const signInWithApple = async (): Promise<{ user: User; idToken: string }> => {
	const rawNonce = Math.random().toString(36).substring(2);
	const appleCredential = await AppleAuthentication.signInAsync({
		requestedScopes: [
			AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
			AppleAuthentication.AppleAuthenticationScope.EMAIL,
		],
		nonce: rawNonce,
	});

	if (!appleCredential.identityToken) {
		throw new Error('Apple Sign-in failed to provide an identity token.');
	}

	const auth = getFirebaseAuth();
	const provider = new OAuthProvider('apple.com');
	const firebaseCredential = provider.credential({
		idToken: appleCredential.identityToken,
		rawNonce,
	});

	const userCredential = await signInWithCredential(auth, firebaseCredential);
	const idToken = await userCredential.user.getIdToken();

	return { user: userCredential.user, idToken };
};
