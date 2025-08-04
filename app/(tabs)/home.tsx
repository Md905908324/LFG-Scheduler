import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Calendar } from 'react-native-calendars';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import ICAL from 'ical.js';
import { useState } from 'react';
import { usePersistentData, Event } from '../data/data'; // Use persistent data hook
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { importedEvents, saveImportedEvents } = usePersistentData(); // Use imported events
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(today); // Set today's date as the initial selected date
  const router = useRouter();
  const importCalendar = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/calendar',
      });

      if (result.canceled) {
        console.log('User canceled the file picker');
        alert('File selection was canceled.');
        return;
      }

      const fileUri = result.assets[0].uri;
      const icsData = await FileSystem.readAsStringAsync(fileUri);
      let jcalData;
      try {
        jcalData = ICAL.parse(icsData);
      } catch (error) {
        console.error('Error parsing .ics file:', error);
        alert('Failed to parse the calendar file. Please ensure it is a valid .ics file.');
        return;
      }
      const vcalendar = new ICAL.Component(jcalData);
      const vevents = vcalendar.getAllSubcomponents('vevent');

      const importedEvents = vevents.map((vevent) => {
        const event = new ICAL.Event(vevent);
        const startDate = event.startDate.toJSDate();
        const endDate = event.endDate.toJSDate();

        return {
          id: event.uid,
          title: event.summary,
          time: `${startDate.toLocaleDateString(undefined, {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })} - ${endDate.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          })}`, // Format without seconds
          date: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          address: 'Imported Event Address', // Placeholder for imported events
          rating: 'N/A', // Placeholder for imported events
          image: 'https://via.placeholder.com/150/333333/FFFFFF?text=Imported', // Placeholder image
        };
      });

      const updatedEvents: Event[] = [...importedEvents];
      importedEvents.forEach((newEvent) => {
        const existingIndex = updatedEvents.findIndex((event) => event.id === newEvent.id);
        if (existingIndex !== -1) {
          // Overwrite the existing event
          updatedEvents[existingIndex] = newEvent;
        } else {
          // Add the new event
          updatedEvents.push(newEvent);
        }
      });
      saveImportedEvents(updatedEvents);

      alert('Calendar imported successfully!');
      console.log('Imported events:', importedEvents);
    } catch (error) {
      console.error('Error importing calendar:', error);
      alert('Failed to import calendar.');
    }
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventContainer}>
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventTime}>{item.time}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const markedDates = importedEvents.reduce<Record<string, { marked?: boolean; dotColor?: string; selected?: boolean; selectedColor?: string }>>((acc, event) => {
    if (event?.date) { // Ensure event and event.date are defined
      acc[event.date] = { marked: true, dotColor: '#00FF00' };
    }
    return acc;
  }, {});

  markedDates[selectedDate] = {
    ...(markedDates[selectedDate] || {}),
    selected: true,
    selectedColor: '#00FF00',
  };

  markedDates[today] = {
    ...(markedDates[today] || {}),
    marked: true,
    dotColor: '#FF0000', // Highlight today's date with a red dot
  };

  return (
    <FlatList
      data={importedEvents.filter((event) => event.date === selectedDate)}
      keyExtractor={(item) => item.id}
      renderItem={renderEvent}
      ListHeaderComponent={
        <>
          <ThemedText type="title" style={styles.greeting}>
            Hi, Matthew 👋
          </ThemedText>
          <View style={styles.calendarContainer}>
            <ThemedText type="subtitle" style={styles.calendarTitle}>
              My Calendar
            </ThemedText>
            <View style={styles.calendarWrapper}>
              <Calendar
                current={today}
                markedDates={markedDates}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                style={styles.calendar}
                theme={{
                  calendarBackground: '#333333',
                  textSectionTitleColor: '#FFFFFF',
                  dayTextColor: '#FFFFFF',
                  todayTextColor: '#FF0000',
                  selectedDayBackgroundColor: '#00FF00',
                  selectedDayTextColor: '#000000',
                  arrowColor: '#00FF00',
                  monthTextColor: '#FFFFFF',
                }}
              />
            </View>
            <View style={styles.calendarButtons}>
              <TouchableOpacity style={styles.importButton} onPress={importCalendar}>
                <Text style={styles.importButtonText}>Import Calendar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.availabilityButton}
                onPress={() => router.push('/my-availabilities')} // Navigate to "My Availabilities" page
              >
                <Text style={styles.availabilityButtonText}>Availabilities</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ThemedText type="subtitle" style={styles.upcomingTitle}>
            Events on {selectedDate}
          </ThemedText>
        </>
      }
      contentContainerStyle={styles.eventList}
      style={styles.container} // Maintain the background and padding
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    paddingBottom: 80,
    backgroundColor: '#151718', // Maintain the dark background
  },
  greeting: {
    fontSize: 24,
    marginBottom: 16,
    color: '#00FF00',
  },
  calendarContainer: {
    marginBottom: 24,
  },
  calendarTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  calendarWrapper: {
    height: 312,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#444444',
    marginBottom: 16,
    justifyContent: 'center',
  },
  calendar: {
    width: '100%',
    height: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#444444',
  },
  calendarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  importButton: {
    flex: 1,
    backgroundColor: '#444444',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  importButtonText: {
    color: '#FFFFFF',
  },
  manageButton: {
    flex: 1,
    backgroundColor: '#00FF00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#000000',
  },
  upcomingTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  eventList: {
    paddingBottom: 16,
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  eventDetails: {
    flex: 1, // Allow the text container to take up available space
    marginRight: 8, // Add spacing between the text and the button
  },
  eventTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    flexWrap: 'wrap', // Ensure the text wraps to the next line if it's too long
  },
  eventTime: {
    fontSize: 14,
    color: '#AAAAAA',
    flexWrap: 'wrap', // Ensure the text wraps to the next line if it's too long
  },
  viewButton: {
    backgroundColor: '#00FF00',
    paddingVertical: 8,  
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  availabilityButton: {
    flex: 1,
    backgroundColor: '#00FF00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  availabilityButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});