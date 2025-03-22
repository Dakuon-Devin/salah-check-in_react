import React, { useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getPrayerTimeById, updatePrayerStatus } from '../repository/PrayerTimeRepository';
import { PrayerTime, PrayerName } from '../models/PrayerTime';
import { scheduleDelayedReminder } from '../services/NotificationService';

type RootStackParamList = {
  Home: undefined;
  Reminder: { prayerId: string };
};

type ReminderScreenRouteProp = RouteProp<RootStackParamList, 'Reminder'>;
type ReminderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Reminder'>;

type Props = {
  route: ReminderScreenRouteProp;
  navigation: ReminderScreenNavigationProp;
};

const ReminderScreen: React.FC<Props> = ({ route, navigation }) => {
  const [prayer, setPrayer] = useState<PrayerTime | null>(null);

  useEffect(() => {
    const prayerId = route.params?.prayerId;
    if (prayerId) {
      loadPrayerTime(prayerId);
    } else {
      navigation.goBack();
    }

    // バックボタンを無効化
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );

    return () => backHandler.remove();
  }, [route.params?.prayerId, navigation]);

  const loadPrayerTime = async (prayerId: string) => {
    try {
      const prayerTime = await getPrayerTimeById(prayerId);
      if (prayerTime) {
        setPrayer(prayerTime);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading prayer time:', error);
      navigation.goBack();
    }
  };

  const handleYesPress = async () => {
    if (prayer) {
      await updatePrayerStatus(prayer.id, true);
      navigation.goBack();
    }
  };

  const handleNoPress = async () => {
    if (prayer) {
      // 30分後に再通知
      scheduleDelayedReminder(prayer);
      navigation.goBack();
    }
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

  if (!prayer) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>礼拝リマインダー</Text>
          <Text style={styles.prayerName}>
            {getPrayerNameJapanese(prayer.name as unknown as string)}
          </Text>
          <Text style={styles.question}>礼拝しましたか？</Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={handleYesPress} 
              style={[styles.button, styles.yesButton]}
            >
              はい
            </Button>
            <Button 
              mode="contained" 
              onPress={handleNoPress}
              style={[styles.button, styles.noButton]}
            >
              いいえ
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '90%',
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  prayerName: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  question: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 8,
  },
  yesButton: {
    backgroundColor: '#4CAF50',
  },
  noButton: {
    backgroundColor: '#F44336',
  },
});

export default ReminderScreen;
