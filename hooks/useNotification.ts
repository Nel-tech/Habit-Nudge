import { Alert, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NudgeFrequency } from '@/store/habitsStore';
import { recordNudge } from '@/store/habitsStore';
import { appEvents, EVENTS } from '@/utils/eventEmitter';
import { FREQUENCIES } from '@/store/habitsStore';

const CHANNEL_ID = 'habit-nudge-channel';

// Quick action button identifiers
const ACTION_FIXED_IT = 'FIXED_IT';
const ACTION_TOO_LATE = 'TOO_LATE';

// Set up notification categories with quick action buttons
export async function setupNotificationActions() {
  await Notifications.setNotificationCategoryAsync('nudge', [
    {
      identifier: ACTION_FIXED_IT,
      buttonTitle: '✓ Fixed it',
      options: {
        isDestructive: false,
        isAuthenticationRequired: false,
        opensAppToForeground: false, // stays in background
      },
    },
    {
      identifier: ACTION_TOO_LATE,
      buttonTitle: '✗ Too late',
      options: {
        isDestructive: false,
        isAuthenticationRequired: false,
        opensAppToForeground: false,
      },
    },
  ]);
}

// Handle user tapping a quick action button
export function setupNotificationResponseHandler() {
  return Notifications.addNotificationResponseReceivedListener(
    async (response) => {
      const actionId = response.actionIdentifier;
      const habitId = response.notification.request.content.data?.habitId as string;

      if (!habitId) return;

      if (actionId === ACTION_FIXED_IT) {
        await recordNudge(habitId, true);
        appEvents.emit(EVENTS.NUDGE_RECORDED); 
      } else if (actionId === ACTION_TOO_LATE) {
        await recordNudge(habitId, false);
        appEvents.emit(EVENTS.NUDGE_RECORDED); 
      }
    }
  );
}

// Set up Android notification channel
async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.deleteNotificationChannelAsync(CHANNEL_ID);
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
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  await setupNotificationChannel();
  await setupNotificationActions();

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
  habitId: string,
  text: string,
  freq: NudgeFrequency
): Promise<void> {
  await setupNotificationChannel();
  await setupNotificationActions();

  const seconds = FREQUENCIES.find((f) => f.value === freq)?.seconds ?? 1800;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔔 Habit Nudge',
      body: text,
      sound: true,
      categoryIdentifier: 'nudge', // attaches quick action buttons
      data: { habitId },           // passed back when button is tapped
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