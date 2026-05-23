

import {
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';

import HomeHeader from '@/app/(tabs)/components/home/HomeHeader';
import HabitCard from '@/app/(tabs)/components/home/HabitCard';
import EmptyState from '@/app/(tabs)/components/home/EmptyState';

import { useHabits } from '@/app/(tabs)/hooks/useHabits';

import { styles } from '@/app/(tabs)/styles/home.styles';

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
                '/setup/SetupScreen'
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