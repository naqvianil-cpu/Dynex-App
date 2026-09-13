import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { registerPushToken } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type PushStatus = 'unknown' | 'granted' | 'denied' | 'unsupported';

// Registers this device's Expo push token against the signed-in worker's
// account (worker_push_tokens), so the send-case-notification Edge
// Function (fired by the trg_notify_worker_on_event DB trigger -- see
// migration 13_worker_push_notifications) has somewhere to deliver a
// status-change alert. Safe to call multiple times; upserts.
export function usePushNotifications(workerAccountId: string | null) {
  const [status, setStatus] = useState<PushStatus>('unknown');

  useEffect(() => {
    if (!workerAccountId) return;
    let cancelled = false;

    async function register() {
      if (!Device.isDevice) {
        setStatus('unsupported'); // simulator/emulator -- no real push token available
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Case updates',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      const existing = await Notifications.getPermissionsAsync();
      let finalStatus = existing.status;
      if (finalStatus !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        finalStatus = requested.status;
      }
      if (finalStatus !== 'granted') {
        if (!cancelled) setStatus('denied');
        return;
      }

      try {
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        const tokenResponse = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined
        );
        await registerPushToken({
          workerAccountId: workerAccountId as string,
          token: tokenResponse.data,
          platform: Platform.OS,
        });
        if (!cancelled) setStatus('granted');
      } catch {
        // Most commonly: no EAS projectId configured yet (see README --
        // "eas build:configure" sets app.json's extra.eas.projectId).
        // Not fatal to the rest of the app.
        if (!cancelled) setStatus('unsupported');
      }
    }

    register();
    return () => {
      cancelled = true;
    };
  }, [workerAccountId]);

  return status;
}
