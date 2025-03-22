import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerTime, PrayerStatus } from '../models/PrayerTime';
import { fetchPrayerTimes } from '../services/AladhanApiService';

const PRAYER_TIMES_KEY = 'prayer_times';

export const getTodayPrayerTimes = async (): Promise<PrayerTime[]> => {
  try {
    // ローカルストレージからの取得を試みる
    const storedTimesJson = await AsyncStorage.getItem(PRAYER_TIMES_KEY);
    
    if (storedTimesJson) {
      const storedTimes: PrayerTime[] = JSON.parse(storedTimesJson);
      const today = new Date().toDateString();
      
      // 今日のデータがあるか確認
      const todayTimes = storedTimes.filter(
        time => new Date(time.time).toDateString() === today
      );
      
      if (todayTimes.length > 0) {
        return todayTimes;
      }
    }
    
    // APIから取得
    const prayerTimes = await fetchPrayerTimes();
    
    // ローカルストレージに保存
    await AsyncStorage.setItem(PRAYER_TIMES_KEY, JSON.stringify(prayerTimes));
    
    return prayerTimes;
  } catch (error) {
    console.error('Error getting prayer times:', error);
    throw error;
  }
};

export const getPrayerTimeById = async (prayerId: string): Promise<PrayerTime | null> => {
  try {
    const storedTimesJson = await AsyncStorage.getItem(PRAYER_TIMES_KEY);
    
    if (storedTimesJson) {
      const storedTimes: PrayerTime[] = JSON.parse(storedTimesJson);
      return storedTimes.find(time => time.id === prayerId) || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting prayer time by ID:', error);
    throw error;
  }
};

export const updatePrayerStatus = async (
  prayerId: string,
  completed: boolean
): Promise<void> => {
  try {
    const storedTimesJson = await AsyncStorage.getItem(PRAYER_TIMES_KEY);
    
    if (storedTimesJson) {
      const storedTimes: PrayerTime[] = JSON.parse(storedTimesJson);
      const updatedTimes = storedTimes.map(time => {
        if (time.id === prayerId) {
          return {
            ...time,
            status: completed ? PrayerStatus.COMPLETED : PrayerStatus.PENDING,
          };
        }
        return time;
      });
      
      await AsyncStorage.setItem(PRAYER_TIMES_KEY, JSON.stringify(updatedTimes));
    }
  } catch (error) {
    console.error('Error updating prayer status:', error);
    throw error;
  }
};
