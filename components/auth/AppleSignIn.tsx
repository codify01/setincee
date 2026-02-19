import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { getDevicePushToken } from '@/utils/notifications/deviceToken';
import { socialSignin } from '@/utils/axiosIntances';
import { getFirebaseAuth } from '@/utils/firebaseClient';

export default function AppleSignIn({ label = 'Continue with Apple' }: { label?: string }) {
	const router = useRouter();
	const { login } = useAuth();

	const handleAppleSignIn = async () => {
		try {
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});

			if (credential.identityToken) {
				const provider = new OAuthProvider('apple.com');
				const firebaseCredential = provider.credential({
					idToken: credential.identityToken,
				});

				const auth = getFirebaseAuth();
				const userCredential = await signInWithCredential(auth, firebaseCredential);
				const user = userCredential.user;
				const idToken = await user.getIdToken();

				const email = credential.email ?? user.email ?? '';
				const firstName = credential.fullName?.givenName ?? user.displayName?.split(' ')[0] ?? '';
				const lastName = credential.fullName?.familyName ?? user.displayName?.split(' ').slice(1).join(' ') ?? '';

				const deviceToken = await getDevicePushToken().catch(() => null);
				await AsyncStorage.multiSet(
					[
						['authProvider', 'apple'],
						['firebaseIdToken', idToken],
						['firebaseUid', user.uid],
						['devicePushToken', deviceToken ?? ''],
					].filter(([, value]) => value !== null && value !== undefined) as [string, string][]
				);

				const socialResponse = await socialSignin({
					email,
					firstName,
					lastName,
				});

				if (socialResponse.data?.token) {
					await login(socialResponse.data.token);
					router.replace('/(tabs)');
				} else {
					router.push('/(auth)/interest');
				}
			}
		} catch (e: any) {
			if (e?.code !== 'ERR_CANCELED') {
				console.error('[auth:social] apple failed', e);
			}
		}
	};

	return (
		<TouchableOpacity
			onPress={handleAppleSignIn}
			className="bg-black py-6 rounded-lg flex-row justify-center items-center gap-2"
		>
			<AntDesign name="apple" size={20} color="#fff" />
			<Text className="text-white text-xl">{label}</Text>
		</TouchableOpacity>
	);
}
