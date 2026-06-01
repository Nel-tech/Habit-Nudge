import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { colors } from '@/constants/theme';
import ArchivedHabitCard from '@/components/past/ArchivedHabitCard';
import EmptyState from '@/components/past/EmptyState';
import { useArchivedHabits } from '@/hooks/useArchivedHabits';
import { styles } from '@/styles/past.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function PastHabitsScreen() {
  const {
    archived,
    refreshing,
    onRefresh,
  } = useArchivedHabits();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
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
        <View style={styles.header}>
          <Text style={styles.title}>
            Past Habits
          </Text>

          <Text style={styles.subtitle}>
            {archived.length > 0
              ? `${archived.length} completed habits`
              : 'Your history lives here'}
          </Text>
        </View>

        {archived.length === 0 ? (
          <EmptyState />
        ) : (
          archived.map((habit) => (
            <ArchivedHabitCard
              key={habit.id}
              habit={habit}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}