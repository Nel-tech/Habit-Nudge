import { Alert, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NudgeFrequency } from '@/store/habitsStore';

const CHANNEL_ID = 'habit-nudge-channel';

// Set up Android notification channel
async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Habit Nudges',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 400, 200, 400],
      lightColor: '#2563EB',
      sound: 'default',
      enableVibrate: true,
      showBadge: false,
    });
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  await setupNotificationChannel();

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') return true;

  Alert.alert(
    'Notifications are off',
    "Habit Nudge works by sending you reminders. Without notifications you won't receive any nudges.\n\nYou can enable them anytime in Settings.",
    [
      { text: 'Skip for now', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]
  );

  return false;
}

export async function scheduleNudges(
  text: string,
  freq: NudgeFrequency
): Promise<void> {
  await setupNotificationChannel();

  const seconds = {
    '30min': 1800,
    '1hour': 3600,
    '2hours': 7200,
  }[freq];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Habit Nudge',
      body: text,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: {
      channelId: CHANNEL_ID,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: true,
    },
  });
}

export async function cancelAllNudges(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}