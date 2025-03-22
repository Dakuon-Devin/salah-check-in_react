import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { getTodayPrayerTimes } from '../repository/PrayerTimeRepository';
import { PrayerTime, PrayerStatus } from '../models/PrayerTime';

const HomeScreen = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrayerTimes();
  }, []);

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      const times = await getTodayPrayerTimes();
      setPrayerTimes(times);
      setError(null);
    } catch (err) {
      setError('礼拝時間の取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
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

  const getStatusText = (status: PrayerStatus): string => {
    switch (status) {
      case PrayerStatus.COMPLETED:
        return '完了';
      case PrayerStatus.MISSED:
        return '未完了';
      case PrayerStatus.PENDING:
        return '待機中';
      default:
        return '';
    }
  };

  const formatTime = (date: Date): string => {
    const d = new Date(date);
    return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  const renderPrayerItem = ({ item }: { item: PrayerTime }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.prayerRow}>
          <Text style={styles.prayerName}>{getPrayerNameJapanese(item.name)}</Text>
          <Text style={styles.prayerTime}>{formatTime(new Date(item.time))}</Text>
          <Text 
            style={[
              styles.prayerStatus, 
              item.status === PrayerStatus.COMPLETED ? styles.completed : 
              item.status === PrayerStatus.MISSED ? styles.missed : 
              styles.pending
            ]}
          >
            {getStatusText(item.status)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error}</Text>
        <Button mode="contained" onPress={loadPrayerTimes} style={styles.button}>
          再試行
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>本日の礼拝時間</Text>
      <FlatList
        data={prayerTimes}
        keyExtractor={item => item.id}
        renderItem={renderPrayerItem}
      />
      <Button mode="contained" onPress={loadPrayerTimes} style={styles.button}>
        更新
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 8,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayerName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  prayerTime: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  prayerStatus: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  completed: {
    color: 'green',
  },
  missed: {
    color: 'red',
  },
  pending: {
    color: 'orange',
  },
  button: {
    marginTop: 16,
  },
});

export default HomeScreen;
