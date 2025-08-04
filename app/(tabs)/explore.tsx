import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { defaultEvents, Event } from '@/app/data/data'; // Import defaultEvents

export default function ExploreScreen() {
  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventContainer}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventAddress}>{item.address}</Text>
        <Text style={styles.eventRating}>{item.rating}</Text>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Recommended for you
        </ThemedText>
      </View>
      <FlatList
        data={defaultEvents} // Use defaultEvents for Explore
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.eventList}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#151718',
    paddingTop: 48,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  eventList: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  eventContainer: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  eventAddress: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 4,
  },
  eventRating: {
    fontSize: 14,
    color: '#AAAAAA',
  },
});