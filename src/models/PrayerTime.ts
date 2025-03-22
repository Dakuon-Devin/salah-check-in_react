export enum PrayerName {
  FAJR = 'FAJR',
  DHUHR = 'DHUHR',
  ASR = 'ASR',
  MAGHRIB = 'MAGHRIB',
  ISHA = 'ISHA'
}

export enum PrayerStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED'
}

export interface PrayerTime {
  id: string;
  name: PrayerName;
  time: Date;
  status: PrayerStatus;
}
