import BackgroundFetch from 'react-native-background-fetch';
import { PrayerStatus } from '../models/PrayerTime';
import { getTodayPrayerTimes } from '../repository/PrayerTimeRepository';
import { schedulePrayerReminder } from './NotificationService';

export const initBackgroundFetch = () => {
  BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // 15分ごとにバックグラウンド実行（最小値）
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
    },
    async taskId => {
      await checkPrayerTimes();
      BackgroundFetch.finish(taskId);
    },
    error => {
      console.error('Background fetch failed to start:', error);
    }
  );
};

export const checkPrayerTimes = async () => {
  try {
    const prayerTimes = await getTodayPrayerTimes();
    const now = new Date();

    prayerTimes.forEach(prayer => {
      const prayerTime = new Date(prayer.time);
      
      // 礼拝時間が過ぎていて、まだ完了していない場合
      if (prayerTime < now && prayer.status === PrayerStatus.PENDING) {
        schedulePrayerReminder(prayer);
      }
    });
  } catch (error) {
    console.error('Error checking prayer times:', error);
  }
};
