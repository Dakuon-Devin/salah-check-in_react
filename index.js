/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { checkPrayerTimes } from './src/services/BackgroundService';

// バックグラウンドタスクの登録
AppRegistry.registerHeadlessTask('RNBackgroundFetch', () => checkPrayerTimes);

AppRegistry.registerComponent(appName, () => App);
