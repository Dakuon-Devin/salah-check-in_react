import axios from 'axios';
import { PrayerName, PrayerStatus, PrayerTime } from '../models/PrayerTime';

interface Timings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerData {
  timings: Timings;
}

interface PrayerTimesResponse {
  data: PrayerData;
}

export const fetchPrayerTimes = async (
  city: string = 'Tokyo',
  country: string = 'Japan',
  method: number = 2
): Promise<PrayerTime[]> => {
  try {
    const response = await axios.get<PrayerTimesResponse>(
      'http://api.aladhan.com/v1/timingsByCity',
      {
        params: {
          city,
          country,
          method,
        },
      }
    );

    const timings = response.data.data.timings;
    const now = new Date();
    
    return [
      {
        id: `${PrayerName.FAJR}-${now.toDateString()}`,
        name: PrayerName.FAJR,
        time: parseTimeString(timings.Fajr, now),
        status: PrayerStatus.PENDING,
      },
      {
        id: `${PrayerName.DHUHR}-${now.toDateString()}`,
        name: PrayerName.DHUHR,
        time: parseTimeString(timings.Dhuhr, now),
        status: PrayerStatus.PENDING,
      },
      {
        id: `${PrayerName.ASR}-${now.toDateString()}`,
        name: PrayerName.ASR,
        time: parseTimeString(timings.Asr, now),
        status: PrayerStatus.PENDING,
      },
      {
        id: `${PrayerName.MAGHRIB}-${now.toDateString()}`,
        name: PrayerName.MAGHRIB,
        time: parseTimeString(timings.Maghrib, now),
        status: PrayerStatus.PENDING,
      },
      {
        id: `${PrayerName.ISHA}-${now.toDateString()}`,
        name: PrayerName.ISHA,
        time: parseTimeString(timings.Isha, now),
        status: PrayerStatus.PENDING,
      },
    ];
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

const parseTimeString = (timeStr: string, date: Date): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const time = new Date(date);
  time.setHours(hours, minutes, 0, 0);
  return time;
};
