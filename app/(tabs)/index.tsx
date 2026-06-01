

import {
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import HomeHeader from '@/components/home/HomeHeader';
import HabitCard from '@/components/home/HabitCard';
import EmptyState from '@/components/home/EmptyState';
import { useHabits } from '@/hooks/useHabits';
import { styles } from '@/styles/home.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    habits,
    refreshing,
    onRefresh,
    archiveHabit,
  } = useHabits();

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top + 16, 64) }
        ]}
      >
        <HomeHeader />

        {habits.length === 0 ? (
          <EmptyState
            onAdd={() =>
              router.push(
                '/setup'
              )
            }
          />
        ) : (
          habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onArchive={() =>
                archiveHabit(habit.id)
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}