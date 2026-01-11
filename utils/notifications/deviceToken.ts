import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export const getDevicePushToken = async (): Promise<string | null> => {
	if (!Device.isDevice) {
		return null;
	}

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== 'granted') {
		return null;
	}

	const projectId =
		Constants.expoConfig?.extra?.eas?.projectId ||
		Constants.easConfig?.projectId ||
		Constants.expoConfig?.extra?.projectId;

	const token = await Notifications.getExpoPushTokenAsync(
		projectId ? { projectId } : undefined
	);

	if (Device.osName === 'Android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
		});
	}

	return token.data;
};
