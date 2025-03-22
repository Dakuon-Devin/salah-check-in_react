# Salah Check-In React Native

元のAndroidアプリのSalah Check-InをReact Nativeで実装したバージョンです。

## 機能

- 礼拝時間の取得と表示
- 礼拝リマインダー通知
- 礼拝完了ステータス管理
- バックグラウンド処理

## ディレクトリ構成

```
src/
├── models/             # データモデル
│   └── PrayerTime.ts   # 礼拝時間モデル
├── services/           # サービス
│   ├── AladhanApiService.ts    # API通信
│   ├── NotificationService.ts  # 通知
│   └── BackgroundService.ts    # バックグラウンド処理
├── repository/         # データ管理
│   └── PrayerTimeRepository.ts # 礼拝時間リポジトリ
├── screens/            # 画面
│   ├── HomeScreen.tsx  # ホーム画面
│   └── ReminderScreen.tsx # リマインダー画面
└── App.tsx             # アプリケーションのルート
```

## 技術スタック

- React Native
- TypeScript
- React Navigation
- React Native Paper
- AsyncStorage
- React Native Background Fetch
- React Native Push Notification

## 動作確認方法

### 必要条件

- Node.js 14以上
- npm または yarn
- React Native CLI
- Android Studio（Androidの場合）
- Xcode（iOSの場合）

### セットアップ

1. リポジトリをクローン
```
git clone https://github.com/Dakuon-Devin/salah-check-in_react.git
cd salah-check-in_react
```

2. 依存関係のインストール
```
npm install
# または
yarn install
```

3. iOSの場合（Macのみ）
```
cd ios
pod install
cd ..
```

### 実行

#### Android
```
npx react-native run-android
```

#### iOS（Macのみ）
```
npx react-native run-ios
```

### 動作確認ポイント

1. ホーム画面
   - 礼拝時間が正しく表示されるか
   - 更新ボタンで最新の礼拝時間が取得できるか

2. 通知
   - 礼拝時間になると通知が表示されるか
   - 通知をタップするとリマインダー画面が表示されるか

3. リマインダー画面
   - 「はい」ボタンで礼拝完了としてマークされるか
   - 「いいえ」ボタンで30分後に再通知されるか

## 元のAndroidアプリとの違い

- Kotlinの代わりにTypeScriptを使用
- Android固有のコンポーネントの代わりにReact Nativeコンポーネントを使用
- WorkManagerの代わりにReact Native Background Fetchを使用
- Room DBの代わりにAsyncStorageを使用

## ライセンス

MIT
