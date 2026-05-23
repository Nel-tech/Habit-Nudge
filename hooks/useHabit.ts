  import {
  Alert,
} from 'react-native';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NudgeFrequency } from '@/store/habitsStore';
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
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') return true;

    Alert.alert(
      'Notifications are off',
      "Habit Nudge works by sending you silent reminders. Without notifications you won't receive any nudges.\n\nYou can enable them anytime in Settings.",
      [
        { text: 'Skip for now', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }



   export async function scheduleNudges(text: string, freq: NudgeFrequency) {
  const seconds = { '30min': 1800, '1hour': 3600, '2hours': 7200 }[freq];
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Habit Nudge',
      body: text,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
      vibrate: [0, 250, 250, 250],
      sticky: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: true,
    },
  });
}