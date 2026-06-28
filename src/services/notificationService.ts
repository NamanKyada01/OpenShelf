import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';

export async function requestNotificationPermission() {
  await notifee.requestPermission();
}

export async function scheduleDailyReminder(hour: number = 20, minute: number = 0) {
  // Clear any existing reminders
  await notifee.cancelAllNotifications();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'daily-reminders',
    name: 'Daily Reminders',
    description: 'Reminds you to log your daily activity on OpenShelf',
  });

  const date = new Date(Date.now());
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);

  // If the time has already passed today, schedule for tomorrow
  if (date.getTime() < Date.now()) {
    date.setDate(date.getDate() + 1);
  }

  // Create a trigger that repeats daily
  await notifee.createTriggerNotification(
    {
      title: 'Keep your streak alive! 🔥',
      body: "Don't forget to log your media today on OpenShelf.",
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    }
  );
}
