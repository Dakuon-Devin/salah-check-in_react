import PushNotification from 'react-native-push-notification';
import { PrayerTime } from '../models/PrayerTime';

export const initNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: 'prayer-reminders',
      channelName: 'Prayer Reminders',
      channelDescription: 'Reminders for prayer times',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    created => console.log(`Channel created: ${created}`)
  );
};

export const schedulePrayerReminder = (prayer: PrayerTime) => {
  PushNotification.localNotificationSchedule({
    channelId: 'prayer-reminders',
    title: '礼拝リマインダー',
    message: `${getPrayerNameJapanese(prayer.name)}の礼拝を行いましたか？`,
    date: new Date(Date.now() + 1000), // すぐに表示（実際には時間経過後に表示）
    allowWhileIdle: true,
    userInfo: { prayerId: prayer.id },
  });
};

export const scheduleDelayedReminder = (prayer: PrayerTime, delayMinutes: number = 30) => {
  PushNotification.localNotificationSchedule({
    channelId: 'prayer-reminders',
    title: '礼拝リマインダー',
    message: `${getPrayerNameJapanese(prayer.name)}の礼拝をまだ行っていません`,
    date: new Date(Date.now() + delayMinutes * 60 * 1000),
    allowWhileIdle: true,
    userInfo: { prayerId: prayer.id },
  });
};

const getPrayerNameJapanese = (name: string): string => {
  switch (name) {
    case 'FAJR':
      return 'ファジュル';
    case 'DHUHR':
      return 'ズフル';
    case 'ASR':
      return 'アスル';
    case 'MAGHRIB':
      return 'マグリブ';
    case 'ISHA':
      return 'イシャー';
    default:
      return name;
  }
};
