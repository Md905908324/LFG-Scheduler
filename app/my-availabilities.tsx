import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePersistentData } from '@/app/data/data';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function MyAvailabilitiesScreen() {
  const { openTimeslots } = usePersistentData(); // Access open timeslots from persistent data
  const [startDate, setStartDate] = useState(''); // Start date input
  const [endDate, setEndDate] = useState(''); // End date input
  const [filteredTimeslots, setFilteredTimeslots] = useState<{ date: string; start: string; end: string }[]>([]);
  const router = useRouter();

  // Helper function to auto-format date input
  const formatDateInput = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 4) {
      return numericValue; // Only year
    } else if (numericValue.length <= 6) {
      return `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`; // Year-Month
    } else {
      return `${numericValue.slice(0, 4)}-${numericValue.slice(4, 6)}-${numericValue.slice(6, 8)}`; // Year-Month-Day
    }
  };

  // Filter timeslots based on the input date range
  const filterTimeslots = () => {
    if (!startDate || !endDate) {
      alert('Please enter both start and end dates.');
      return;
    }

    if (openTimeslots.length === 0) {
      Alert.alert('Debug Info', 'No open timeslots available in the data.');
      return;
    }

    const filtered = openTimeslots.filter((timeslot) => {
      const timeslotDate = new Date(timeslot.date);
      const inputStartDate = new Date(startDate);
      const inputEndDate = new Date(endDate);

      return timeslotDate >= inputStartDate && timeslotDate <= inputEndDate;
    });

    if (filtered.length === 0) {
      Alert.alert('No Results', 'No open timeslots found for the selected date range.');
    }

    setFilteredTimeslots(filtered);
  };

  const renderTimeslot = ({ item }: { item: { date: string; start: string; end: string } }) => (
    <View style={styles.timeslotContainer}>
      <Text style={styles.timeslotDate}>{item.date}</Text>
      <Text style={styles.timeslotTime}>
        {item.start} - {item.end}
      </Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>{'<'}</Text>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            Open Timeslots
          </ThemedText>
        </View>

        {/* Date Range Inputs */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            placeholderTextColor="#AAAAAA"
            value={startDate}
            onChangeText={(text) => setStartDate(formatDateInput(text))} // Auto-format input
            keyboardType="numeric" // Numeric keyboard
            maxLength={10} // Limit to YYYY-MM-DD format
          />
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD)"
            placeholderTextColor="#AAAAAA"
            value={endDate}
            onChangeText={(text) => setEndDate(formatDateInput(text))} // Auto-format input
            keyboardType="numeric" // Numeric keyboard
            maxLength={10} // Limit to YYYY-MM-DD format
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              Keyboard.dismiss(); // Dismiss the keyboard when the button is pressed
              filterTimeslots();
            }}
          >
            <Text style={styles.filterButtonText}>Show Availabilities</Text>
          </TouchableOpacity>
        </View>

        {/* Timeslots List */}
        {filteredTimeslots.length > 0 ? (
          <FlatList
            data={filteredTimeslots}
            keyExtractor={(item, index) => `${item.date}-${index}`}
            renderItem={renderTimeslot}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={styles.noTimeslots}>No open timeslots available.</Text>
        )}
      </ThemedView>
    </TouchableWithoutFeedback>
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
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#00FF00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  timeslotContainer: {
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  timeslotDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timeslotTime: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  noTimeslots: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 16,
  },
});