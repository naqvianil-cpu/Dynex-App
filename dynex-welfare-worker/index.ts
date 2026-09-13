import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';

import App from './App';

// Keep the native (pre-JS) splash on screen until DynexSplashScreen has
// mounted and painted its own, identical-looking navy + logo frame, so
// the hand-off from native splash -> in-app animated splash has no flash.
// See src/components/splash/DynexSplashScreen.tsx for the matching
// SplashScreen.hideAsync() call.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Safe to ignore -- e.g. already called, or running on web.
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
