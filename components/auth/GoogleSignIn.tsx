import React, { useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { getDevicePushToken } from '@/utils/notifications/deviceToken';
import { socialSignin } from '@/utils/axiosIntances';
import { getFirebaseAuth } from '@/utils/firebaseClient';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const getRedirectUri = () => {
	const platformClientId =
		Platform.OS === 'ios'
			? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
			: Platform.OS === 'android'
				? process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
				: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
	const reverseClientId = platformClientId
		? `com.googleusercontent.apps.${platformClientId.split('.apps.googleusercontent.com')[0]}`
		: null;
	const scheme = Constants.expoConfig?.scheme ?? 'bryze';
	return reverseClientId
		? AuthSession.makeRedirectUri({ scheme: reverseClientId })
		: AuthSession.makeRedirectUri({ scheme });
};

export default function GoogleSignIn({ label = 'Continue with Google' }: { label?: string }) {
	const router = useRouter();
	const { login } = useAuth();

	const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
		webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
		iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
		androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
		redirectUri: getRedirectUri(),
	});

	useEffect(() => {
		const handleSignIn = async () => {
			try {
				if (response?.type === 'success' && response.params.id_token) {
					const { id_token } = response.params;
					const credential = GoogleAuthProvider.credential(id_token);
					const auth = getFirebaseAuth();
					const userCredential = await signInWithCredential(auth, credential);
					const user = userCredential.user;
					const idToken = await user.getIdToken();

					const deviceToken = await getDevicePushToken().catch(() => null);
					await AsyncStorage.multiSet(
						[
							['authProvider', 'google'],
							['firebaseIdToken', idToken],
							['firebaseUid', user.uid],
							['devicePushToken', deviceToken ?? ''],
						].filter(([, value]) => value !== null && value !== undefined) as [string, string][]
					);

					const socialResponse = await socialSignin({
						email: user.email ?? '',
						firstName: user.displayName?.split(' ')[0] ?? '',
						lastName: user.displayName?.split(' ').slice(1).join(' ') ?? '',
					});

					if (socialResponse.data?.token) {
						await login(socialResponse.data.token);
						router.replace('/(tabs)');
					} else {
						router.push('/(auth)/interest');
					}
				}
			} catch (err: any) {
				console.error('[auth:social] google failed', err);
			}
		};

		handleSignIn();
	}, [response]);

	return (
		<TouchableOpacity
			disabled={!request}
			onPress={() => promptAsync()}
			className="border border-neutral-300 py-6 rounded-lg flex-row justify-center items-center gap-2"
		>
			<AntDesign name="google" size={20} color="#414141" />
			<Text className="text-xl">{label}</Text>
		</TouchableOpacity>
	);
}
