import { StatusBar } from 'expo-status-bar';
import { AccountScreen } from './src/account/AccountScreen';

export default function App() {
  return (
    <>
      <AccountScreen />
      <StatusBar style="auto" />
    </>
  );
}
