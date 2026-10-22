import { Platform } from 'react-native';

export const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');
