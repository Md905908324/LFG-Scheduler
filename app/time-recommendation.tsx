import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router';

export default function TimeRecommendationScreen() {
  const router: ReturnType<typeof useRouter> = useRouter();
  const { groupId } = useGlobalSearchParams();
  const id = Array.isArray(groupId) ? groupId[0] : groupId;

  interface Time {
    id: string;
    time: string;
    members: string;
    availability: number; // 3 = 3 members, 4 = 4 members, 5 = all members
    duration: number; // Duration in hours
  }

  // Refined base times to allow merging
  const baseTimes: Time[] = [
    { id: '1', time: '5/1/25 9:00AM to 12:00PM', members: 'All members available', availability: 5, duration: 3 },
    { id: '2', time: '5/1/25 11:00AM to 3:00PM', members: '4 members available', availability: 4, duration: 4 },
    { id: '3', time: '5/1/25 2:00PM to 6:00PM', members: '3 members available', availability: 3, duration: 4 },
    { id: '4', time: '5/2/25 10:00AM to 2:00PM', members: 'All members available', availability: 5, duration: 4 },
    { id: '5', time: '5/2/25 1:00PM to 5:00PM', members: '4 members available', availability: 4, duration: 4 },
    { id: '6', time: '5/2/25 4:00PM to 8:00PM', members: '3 members available', availability: 3, duration: 4 },
    { id: '7', time: '5/3/25 9:00AM to 1:00PM', members: 'All members available', availability: 5, duration: 4 },
    { id: '8', time: '5/3/25 12:00PM to 4:00PM', members: '4 members available', availability: 4, duration: 4 },
    { id: '9', time: '5/3/25 3:00PM to 7:00PM', members: '3 members available', availability: 3, duration: 4 },
  ];

  const expandedTimes: Time[] = [];

  // Helper function to merge overlapping time ranges
  const mergeTimeRanges = (time1: string, time2: string): string => {
    const [start1, end1] = time1.split(' to ');
    const [start2, end2] = time2.split(' to ');

    const start = new Date(Math.min(new Date(start1).getTime(), new Date(start2).getTime()));
    const end = new Date(Math.max(new Date(end1).getTime(), new Date(end2).getTime()));

    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Expand and merge times based on availability
  baseTimes.forEach((time) => {
    const existingTime = expandedTimes.find(
      (t) => t.availability === time.availability && t.time.split(' to ')[1] === time.time.split(' to ')[0]
    );

    if (existingTime) {
      // Merge overlapping time ranges
      existingTime.time = mergeTimeRanges(existingTime.time, time.time);
      existingTime.duration += time.duration;
    } else {
      expandedTimes.push({ ...time });
    }

    if (time.availability === 5) {
      // Add the same time for 4 and 3 members
      expandedTimes.push({
        ...time,
        members: '4 members available',
        availability: 4,
      });
      expandedTimes.push({
        ...time,
        members: '3 members available',
        availability: 3,
      });
    } else if (time.availability === 4) {
      // Add the same time for 3 members
      expandedTimes.push({
        ...time,
        members: '3 members available',
        availability: 3,
      });
    }
  });

  // Sort times: All members first, then 4 members, then 3 members
  const sortedTimes = expandedTimes.sort((a, b) => {
    const dateA = new Date(a.time.split(' to ')[0]);
    const dateB = new Date(b.time.split(' to ')[0]);
    if (dateA.getTime() === dateB.getTime()) {
      return b.availability - a.availability;
    }
    return dateA.getTime() - dateB.getTime();
  });

  const renderTime = ({ item }: { item: Time }) => (
    <View style={styles.timeContainer}>
      <View>
        <Text style={styles.timeText}>{item.time}</Text>
        <Text style={styles.membersText}>{item.members}</Text>
        <Text style={styles.durationText}>Duration: {item.duration} hours</Text>
      </View>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => router.push('/event-recommendation')} // Navigate to Event Recommendation
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const handleBack = () => {
    router.replace(`/group-chat?groupId=${encodeURIComponent(id)}`);
  };

  const handleEditPreferences = () => {
    router.push(`/group-preferences?groupId=${encodeURIComponent(id)}`);
  };

  const handleRegenerateResults = () => {
    console.log('Regenerate Results button pressed');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          Recommended Times
        </ThemedText>
      </View>
      <FlatList
        data={sortedTimes}
        keyExtractor={(item) => item.id + item.availability}
        renderItem={renderTime}
        contentContainerStyle={styles.timeList}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.editPreferencesButton} onPress={handleEditPreferences}>
          <Text style={styles.editPreferencesText}>+ Edit Group Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerateResults}>
          <Text style={styles.regenerateButtonText}>Regenerate Results</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#151718',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  timeList: {
    flexGrow: 1,
    gap: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  membersText: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  durationText: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  viewButton: {
    backgroundColor: '#444444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  footer: {
    marginTop: 16,
  },
  editPreferencesButton: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  editPreferencesText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  regenerateButton: {
    backgroundColor: '#00FF00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  regenerateButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});