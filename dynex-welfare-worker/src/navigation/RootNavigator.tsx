import React, { useState } from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LookupsProvider } from '../context/LookupsContext';
import { DynexSplashScreen } from '../components/splash';
import { colors } from '../theme';

import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MyCasesScreen from '../screens/MyCasesScreen';
import CaseDetailScreen from '../screens/CaseDetailScreen';
import SubmitGrievanceScreen from '../screens/SubmitGrievanceScreen';
import EvidenceScreen from '../screens/EvidenceScreen';
import SettingsScreen from '../screens/SettingsScreen';

import type { AuthStackParamList, CasesStackParamList, TabParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const CasesStack = createNativeStackNavigator<CasesStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function CasesNavigator() {
  const { strings } = useLanguage();
  return (
    <CasesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <CasesStack.Screen
        name="MyCases"
        component={MyCasesScreen}
        options={{ title: strings.myCases.title }}
      />
      <CasesStack.Screen
        name="CaseDetail"
        component={CaseDetailScreen}
        // CaseDetailScreen sets its own header title (the case reference
        // number) via navigation.setOptions once it has loaded the case.
        options={{ title: '' }}
      />
    </CasesStack.Navigator>
  );
}

function MainTabs() {
  const { strings } = useLanguage();
  return (
    <LookupsProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.brand,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        }}
      >
        <Tab.Screen
          name="Cases"
          component={CasesNavigator}
          options={{ title: strings.myCases.title }}
        />
        <Tab.Screen
          name="Submit"
          component={SubmitGrievanceScreen}
          options={{ title: strings.submit.title }}
        />
        <Tab.Screen
          name="Evidence"
          component={EvidenceScreen}
          options={{ title: strings.evidence.title }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: strings.settings.title }}
        />
      </Tab.Navigator>
    </LookupsProvider>
  );
}

// Gates, in order: language chosen? -> signed in? -> main app.
// Mirrors the worker's actual first-run journey (pick a language once,
// then either sign in with an existing Worker ID + PIN or register one).
export default function RootNavigator() {
  const { ready: languageReady, hasChosen, isRTL } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  // Layout direction only matters for Urdu and Arabic today; forcing it at runtime
  // would require a full app reload in RN, so screens instead read isRTL
  // directly (see SubmitGrievanceScreen/LoginScreen) rather than relying
  // on I18nManager.forceRTL, which needs a restart to take effect.
  void I18nManager;

  // The animated launch screen owns this gate instead of a bare spinner:
  // it waits for language + auth state to resolve (same condition the
  // old `<LoadingView />` gated on) AND its own minimum on-screen time,
  // then cross-fades into the real navigation tree below.
  if (!splashDone) {
    return (
      <DynexSplashScreen
        ready={languageReady && !authLoading}
        onFinish={() => setSplashDone(true)}
      />
    );
  }

  return (
    <NavigationContainer>
      {!hasChosen ? (
        <LanguageSelectScreen />
      ) : !session ? (
        <AuthNavigator />
      ) : (
        <MainTabs />
      )}
    </NavigationContainer>
  );
}
