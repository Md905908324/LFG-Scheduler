import { useEffect, useState } from 'react';
import { saveToSecureStore, getFromSecureStore } from '@/app/utils/secureStore';
import sampleEvents from './sample_events.json'; // Import the JSON file

export interface Preferences {
  interests: string;
  priceRange: string;
  distance: string;
}



export interface Member {
  id: string;
  name: string;
  status: string;
  link: boolean;
  preferences?: Preferences; // Add preferences property
}

export interface Event {
  id: string;
  title: string;
  time: string;
  date: string;
  address: string;
  rating: string;
  image: string;
}

export interface GroupPreferences {
  selectedInterests: string[];
  selectedPriceRanges: string[];
  selectedDistances: string[];
  upperTimeLimit: string;
  lowerTimeLimit: string;
  minimumEventTime: string;
  startDate: string;
  endDate: string;
  minimumMembers: string;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  groupPreferences: GroupPreferences; // Update this to use the new GroupPreferences interface
}

export interface OpenTimeslot {
  date: string;
  start: string;
  end: string;
}

const defaultGroups: Group[] = [
  {
    id: '1',
    name: 'East Brunswick Bowling Club',
    members: [
      {
        id: '1',
        name: 'You',
        status: 'Unsubmitted',
        link: true,
        preferences: undefined, // Unsubmitted, leave blank
      },
      {
        id: '2',
        name: 'John',
        status: 'Submitted',
        link: false,
        preferences: {
          interests: 'Bowling, Social, Games', // Standardize interests with existing ones
          priceRange: '$$ 20-50',
          distance: 'Within 5 mi',
        },
      },
      {
        id: '3',
        name: 'Alice',
        status: 'Unsubmitted',
        link: false,
        preferences: undefined, // Unsubmitted, leave blank
      },
      {
        id: '4',
        name: 'Michael',
        status: 'Submitted',
        link: false,
        preferences: {
          interests: 'Bowling, Food & Drink, Nightlife',
          priceRange: '$$$ 50+',
          distance: '2-5 mi',
        },
      },
      {
        id: '5',
        name: 'Sarah',
        status: 'Unsubmitted',
        link: false,
        preferences: undefined, // Unsubmitted, leave blank
      },
    ],
    groupPreferences: {
      selectedInterests: [],
      selectedPriceRanges: [],
      selectedDistances: [],
      upperTimeLimit: '',
      lowerTimeLimit: '',
      minimumEventTime: '',
      startDate: '',
      endDate: '',
      minimumMembers: '',
    }, // Example group preferences
  },
  {
    id: '2',
    name: 'lets play smth',
    members: [
      {
        id: '1',
        name: 'You',
        status: 'Unsubmitted',
        link: true,
        preferences: undefined, // Unsubmitted, leave blank
      },
      {
        id: '6',
        name: 'Evan',
        status: 'Submitted',
        link: false,
        preferences: {
          interests: 'Food & Drink, Fitness, Music',
          priceRange: '$ 0-20',
          distance: 'Within 1 mi',
        },
      },
      {
        id: '7',
        name: 'Maria',
        status: 'Unsubmitted',
        link: false,
        preferences: undefined, // Unsubmitted, leave blank
      },
      {
        id: '8',
        name: 'Chris',
        status: 'Submitted',
        link: false,
        preferences: {
          interests: 'Fitness, Social, Technology',
          priceRange: '$$ 20-50',
          distance: '5-10 mi',
        },
      },
    ],
    groupPreferences: {
      selectedInterests: [],
      selectedPriceRanges: [],
      selectedDistances: [],
      upperTimeLimit: '',
      lowerTimeLimit: '',
      minimumEventTime: '',
      startDate: '',
      endDate: '',
      minimumMembers: '',
    }, // Example group preferences
  },
  {
    id: '3',
    name: 'casual stuff in nj',
    members: [
      {
        id: '1',
        name: 'You',
        status: 'Unsubmitted',
        link: true,
        preferences: undefined, // Unsubmitted, leave blank
      },
      {
        id: '9',
        name: 'Anna',
        status: 'Unsubmitted',
        link: false,
        preferences: undefined, // Unsubmitted, leave blank
      },
      {
        id: '10',
        name: 'Tom',
        status: 'Submitted',
        link: false,
        preferences: {
          interests: 'Adventure, Travel, Nature',
          priceRange: '$$$ 50+',
          distance: '10+ mi',
        },
      },
      {
        id: '11',
        name: 'Emma',
        status: 'Unsubmitted',
        link: false,
        preferences: undefined, // Unsubmitted, leave blank
      },
      {
        id: '12',
        name: 'James',
        status: 'Submitted',
        link: false,
        preferences: {
          interests: 'Shopping, Wellness, Networking',
          priceRange: '$ 0-20',
          distance: '2-5 mi',
        },
      },
    ],
    groupPreferences: {
      selectedInterests: [],
      selectedPriceRanges: [],
      selectedDistances: [],
      upperTimeLimit: '',
      lowerTimeLimit: '',
      minimumEventTime: '',
      startDate: '',
      endDate: '',
      minimumMembers: '',
    }, // Example group preferences
  },
];

// Default events for "Explore"
export const defaultEvents: Event[] = sampleEvents;

export function usePersistentData() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [importedEvents, setImportedEvents] = useState<Event[]>([]); // Imported events for "Home"
  const [openTimeslots, setOpenTimeslots] = useState<OpenTimeslot[]>([]); // Open timeslots for recommendations

  // Load data from secure storage
  useEffect(() => {
    const loadData = async () => {
      const storedGroups = await getFromSecureStore('groups');
      const storedImportedEvents = await getFromSecureStore('importedEvents');

      setGroups(storedGroups ? JSON.parse(storedGroups) : defaultGroups);
      const parsedEvents = storedImportedEvents ? JSON.parse(storedImportedEvents) : [];
      setImportedEvents(parsedEvents);

      // Log imported events
      console.log('Imported Events:', parsedEvents);
    };

    loadData();
  }, []);

  useEffect(() => {
    const calculateOpenTimeslots = (events: Event[]): OpenTimeslot[] => {
      const groupedByDate: Record<string, Event[]> = {};
  
      // Group events by date
      events.forEach((event) => {
        if (!groupedByDate[event.date]) {
          groupedByDate[event.date] = [];
        }
        groupedByDate[event.date].push(event);
      });

      // Convert all dates into a date time format
      // date: '04-14-2025', time: '10:00 AM - 12:00 PM'
      // date: '2025-04-14', time: '05:00 PM - 08:00 PM'
      console.log('Grouped Events by Date:', groupedByDate);
  
      const openTimeslots: OpenTimeslot[] = [];
  
      // Process each date
      Object.keys(groupedByDate).forEach((date) => {
        const eventsForDate = groupedByDate[date];
  
        // Sort events by start time
        eventsForDate.sort((a, b) => {
          const aStart = new Date(`${date}T${cleanTime(a.time.split(' - ')[0])}`);
          const bStart = new Date(`${date}T${cleanTime(b.time.split(' - ')[0])}`);
          return aStart.getTime() - bStart.getTime();
        });
  
        // Find gaps between events
        //Add start of day and end of the day into current event ends and open timeslots to account for single event days.
        for (let i = 0; i < eventsForDate.length - 1; i++) {
          const currentEventEnd = new Date(`${date}T${cleanTime(eventsForDate[i].time.split(' - ')[1])}`);
          const nextEventStart = new Date(`${date}T${cleanTime(eventsForDate[i + 1].time.split(' - ')[0])}`);
  
          if (currentEventEnd < nextEventStart) {
            openTimeslots.push({
              date,
              start: currentEventEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              end: nextEventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          }
        }
      });
  
      return openTimeslots;
    };
  
    // Helper function to clean the time field
    const cleanTime = (time: string): string => {
      // Remove the day of the week (e.g., "Fri")
      return time.replace(/^[A-Za-z]{3}\s/, '');
    };
  
    const timeslots = calculateOpenTimeslots(importedEvents);
    setOpenTimeslots(timeslots);
  
    // Log the calculated open timeslots
    console.log('Open Timeslots:', timeslots);
  }, [importedEvents]);

  // Save groups to secure storage
  const saveGroups = async (updatedGroups: Group[]) => {
    setGroups(updatedGroups);
    await saveToSecureStore('groups', JSON.stringify(updatedGroups));
  };

  // Save imported events to secure storage
  const saveImportedEvents = async (updatedEvents: Event[]) => {
    setImportedEvents(updatedEvents);
    try {
      await saveToSecureStore('importedEvents', JSON.stringify(updatedEvents));
      console.log('Saved Imported Events:', updatedEvents);
    } catch (error) {
      console.error('Error saving imported events to SecureStore:', error);
    }
  };

  return { groups, importedEvents, openTimeslots, saveGroups, saveImportedEvents };
}

export default {}; // Add a default export to avoid errors