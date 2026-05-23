

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
export default function HomeScreen() {
  const router = useRouter();

  const {
    habits,
    refreshing,
    onRefresh,
    archiveHabit,
    handleCheckin,
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
        contentContainerStyle={
          styles.scrollContent
        }
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
              onCaught={() =>
                handleCheckin(
                  habit.id,
                  true
                )
              }
              onMissed={() =>
                handleCheckin(
                  habit.id,
                  false
                )
              }
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