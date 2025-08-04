import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BlurTabBarBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#151718' }]} />
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
