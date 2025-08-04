import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdowns
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useGlobalSearchParams } from 'expo-router'; // Use search params to get groupId
import { useState } from 'react';
import { interestOptions, priceRangeOptions, distanceOptions } from '@/app/data/filter-options';
import { usePersistentData } from '@/app/data/data'; // Import persistent data hook

export default function GroupPreferencesScreen() {
  const router = useRouter();
  const { groupId } = useGlobalSearchParams(); // Get groupId from URL
  const id = Array.isArray(groupId) ? groupId[0] : groupId; // Ensure groupId is a string
  const { groups, saveGroups } = usePersistentData(); // Access groups and saveGroups from persistent data

  // Find the group by ID
  const group = groups.find((g) => g.id === groupId);
  const totalGroupMembers = group ? group.members.length : 0;

  // State for group preferences
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);
  const [upperTimeLimit, setUpperTimeLimit] = useState('11:00 PM');
  const [lowerTimeLimit, setLowerTimeLimit] = useState('11:00 AM');
  const [minimumEventTime, setMinimumEventTime] = useState('3 Hours');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minimumMembers, setMinimumMembers] = useState('3');

  const handleBack = () => {
    router.back();
  };

  const toggleSelection = (
    item: string,
    selectedItems: string[],
    setSelectedItems: (items: string[]) => void,
    maxSelections: number
  ) => {
    if (item === 'Neutral') {
      setSelectedItems(['Neutral']);
    } else {
      const filteredItems = selectedItems.filter((i) => i !== 'Neutral');
      if (filteredItems.includes(item)) {
        setSelectedItems(filteredItems.filter((i) => i !== item));
      } else if (filteredItems.length < maxSelections) {
        setSelectedItems([...filteredItems, item]);
      } else {
        alert(`You can select up to ${maxSelections} items only.`);
      }
    }
  };

  const handleSavePreferences = () => {
    if (parseInt(minimumMembers) > totalGroupMembers) {
      Alert.alert('Invalid Input', `Minimum members cannot exceed the total group members (${totalGroupMembers}).`);
      return;
    }

    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          groupPreferences: {
            selectedInterests,
            selectedPriceRanges,
            selectedDistances,
            upperTimeLimit,
            lowerTimeLimit,
            minimumEventTime,
            startDate,
            endDate,
            minimumMembers,
          },
        };
      }
      return group;
    });

    saveGroups(updatedGroups);
    console.log('Group Preferences Saved:', {
      groupId,
      selectedInterests,
      selectedPriceRanges,
      selectedDistances,
      upperTimeLimit,
      lowerTimeLimit,
      minimumEventTime,
      startDate,
      endDate,
      minimumMembers,
    });
    alert('Preferences saved successfully!');
    router.push(`/time-recommendation?groupId=${encodeURIComponent(id)}`); // Navigate to Time Recommendation screen with groupId
  };

  const formatDateInput = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 4) {
      return numericValue;
    } else if (numericValue.length <= 6) {
      return `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`;
    } else {
      return `${numericValue.slice(0, 4)}-${numericValue.slice(4, 6)}-${numericValue.slice(6, 8)}`;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>X</Text>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          Group Preferences
        </ThemedText>
      </View>
      <ScrollView>
        <Text style={styles.description}>
          Set preferences for the group to filter events and times.
        </Text>

        {/* Interests Multi-Selection */}
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Interests (Select up to 3 or Neutral)</Text>
          {interestOptions.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.checkboxContainer,
                selectedInterests.includes(interest) && styles.checkboxSelected,
              ]}
              onPress={() => toggleSelection(interest, selectedInterests, setSelectedInterests, 3)}
            >
              <Text style={styles.checkboxText}>{interest}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Range Multi-Selection */}
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Price Range (Select up to 3 or Neutral)</Text>
          {priceRangeOptions.map((priceRange) => (
            <TouchableOpacity
              key={priceRange}
              style={[
                styles.checkboxContainer,
                selectedPriceRanges.includes(priceRange) && styles.checkboxSelected,
              ]}
              onPress={() => toggleSelection(priceRange, selectedPriceRanges, setSelectedPriceRanges, 3)}
            >
              <Text style={styles.checkboxText}>{priceRange}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Distance Multi-Selection */}
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Distance (No Limit or Neutral)</Text>
          {distanceOptions.map((distance) => (
            <TouchableOpacity
              key={distance}
              style={[
                styles.checkboxContainer,
                selectedDistances.includes(distance) && styles.checkboxSelected,
              ]}
              onPress={() => toggleSelection(distance, selectedDistances, setSelectedDistances, Infinity)}
            >
              <Text style={styles.checkboxText}>{distance}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upper-Lower Time Limits */}
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Upper-Lower Time Limits</Text>
          <Picker
            selectedValue={lowerTimeLimit}
            onValueChange={(itemValue) => setLowerTimeLimit(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="12:00 AM" value="12:00 AM" />
            <Picker.Item label="01:00 AM" value="01:00 AM" />
            <Picker.Item label="02:00 AM" value="02:00 AM" />
            <Picker.Item label="03:00 AM" value="03:00 AM" />
            <Picker.Item label="04:00 AM" value="04:00 AM" />
            <Picker.Item label="05:00 AM" value="05:00 AM" />
            <Picker.Item label="06:00 AM" value="06:00 AM" />
            <Picker.Item label="07:00 AM" value="07:00 AM" />
            <Picker.Item label="08:00 AM" value="08:00 AM" />
            <Picker.Item label="09:00 AM" value="09:00 AM" />
            <Picker.Item label="10:00 AM" value="10:00 AM" />
            <Picker.Item label="11:00 AM" value="11:00 AM" />
            <Picker.Item label="12:00 PM" value="12:00 PM" />
            <Picker.Item label="01:00 PM" value="01:00 PM" />
            <Picker.Item label="02:00 PM" value="02:00 PM" />
            <Picker.Item label="03:00 PM" value="03:00 PM" />
            <Picker.Item label="04:00 PM" value="04:00 PM" />
            <Picker.Item label="05:00 PM" value="05:00 PM" />
            <Picker.Item label="06:00 PM" value="06:00 PM" />
            <Picker.Item label="07:00 PM" value="07:00 PM" />
            <Picker.Item label="08:00 PM" value="08:00 PM" />
            <Picker.Item label="09:00 PM" value="09:00 PM" />
            <Picker.Item label="10:00 PM" value="10:00 PM" />
            <Picker.Item label="11:00 PM" value="11:00 PM" />
          </Picker>
          <Picker
            selectedValue={upperTimeLimit}
            onValueChange={(itemValue) => setUpperTimeLimit(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="12:00 AM" value="12:00 AM" />
            <Picker.Item label="01:00 AM" value="01:00 AM" />
            <Picker.Item label="02:00 AM" value="02:00 AM" />
            <Picker.Item label="03:00 AM" value="03:00 AM" />
            <Picker.Item label="04:00 AM" value="04:00 AM" />
            <Picker.Item label="05:00 AM" value="05:00 AM" />
            <Picker.Item label="06:00 AM" value="06:00 AM" />
            <Picker.Item label="07:00 AM" value="07:00 AM" />
            <Picker.Item label="08:00 AM" value="08:00 AM" />
            <Picker.Item label="09:00 AM" value="09:00 AM" />
            <Picker.Item label="10:00 AM" value="10:00 AM" />
            <Picker.Item label="11:00 AM" value="11:00 AM" />
            <Picker.Item label="12:00 PM" value="12:00 PM" />
            <Picker.Item label="01:00 PM" value="01:00 PM" />
            <Picker.Item label="02:00 PM" value="02:00 PM" />
            <Picker.Item label="03:00 PM" value="03:00 PM" />
            <Picker.Item label="04:00 PM" value="04:00 PM" />
            <Picker.Item label="05:00 PM" value="05:00 PM" />
            <Picker.Item label="06:00 PM" value="06:00 PM" />
            <Picker.Item label="07:00 PM" value="07:00 PM" />
            <Picker.Item label="08:00 PM" value="08:00 PM" />
            <Picker.Item label="09:00 PM" value="09:00 PM" />
            <Picker.Item label="10:00 PM" value="10:00 PM" />
            <Picker.Item label="11:00 PM" value="11:00 PM" />
          </Picker>
        </View>

        {/* Minimum Event Time */}
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Minimum Event Time</Text>
          <Picker
            selectedValue={minimumEventTime}
            onValueChange={(itemValue) => setMinimumEventTime(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="1 Hour" value="1 Hour" />
            <Picker.Item label="2 Hours" value="2 Hours" />
            <Picker.Item label="3 Hours" value="3 Hours" />
            <Picker.Item label="4 Hours" value="4 Hours" />
            <Picker.Item label="5 Hours" value="5 Hours" />
          </Picker>
        </View>

        {/* Date Range */}
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Date Range</Text>
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            keyboardType="numeric"
            value={startDate}
            onChangeText={(text) => setStartDate(formatDateInput(text))}
          />
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD)"
            keyboardType="numeric"
            value={endDate}
            onChangeText={(text) => setEndDate(formatDateInput(text))}
          />
        </View>

        {/* Minimum Members Available */}
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Minimum Members Available</Text>
          <TextInput
            style={styles.input}
            placeholder={`Minimum Members (Max: ${totalGroupMembers})`}
            keyboardType="numeric"
            value={minimumMembers}
            onChangeText={setMinimumMembers}
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
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
  description: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 16,
    textAlign: 'center',
  },
  preferenceItem: {
    marginBottom: 16,
  },
  preferenceText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  checkboxContainer: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkboxSelected: {
    backgroundColor: '#00FF00',
  },
  checkboxText: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#00FF00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});