import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css'
import { useColorScheme } from '@/components/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/context/AuthContext';
import AnimatedSplash from '@/components/AnimatedSplash';
import AsyncStorage from '@react-native-async-storage/async-storage';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(onboarding)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [splashDone, setSplashDone] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(storedValue === 'true');
      } catch (storageError) {
        console.error('Unable to read onboarding status', storageError);
        setHasSeenOnboarding(false);
      }
    };

    loadOnboardingStatus();
  }, []);

    useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && splashDone && hasSeenOnboarding !== null) {
      SplashScreen.hideAsync();
    }
  }, [loaded, splashDone, hasSeenOnboarding])

  if (!loaded || !splashDone || hasSeenOnboarding === null) {
    return (
      <AnimatedSplash onAnimationEnd={() => setSplashDone(true)} />
    );
  }

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  // useEffect(() => {
  //   if (error) throw error;
  // }, [error]);

  // useEffect(() => {
  //   if (loaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  // if (!loaded) {
  //   return null;
  // }
  return <RootLayoutNav hasSeenOnboarding={hasSeenOnboarding} />;

}

function RootLayoutNav({ hasSeenOnboarding }: { hasSeenOnboarding: boolean }) {
  const colorScheme = useColorScheme()

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack initialRouteName={hasSeenOnboarding ? '(auth)' : '(onboarding)'}>
        <Stack.Screen name='(onboarding)' options={{headerShown:false}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)" options={{ presentation: 'modal', headerShown:false }} />
      </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
    // </ThemeProvider>
  );
}
