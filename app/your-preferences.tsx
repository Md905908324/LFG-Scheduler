import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePersistentData } from '@/app/data/data';
import { useState } from 'react';
import { interestOptions, priceRangeOptions, distanceOptions } from '@/app/data/filter-options';

export default function YourPreferencesScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams(); // Get the group ID from the route parameters
  const { groups, saveGroups } = usePersistentData(); // Use persistent data hook

  // State for user preferences
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedDistances, setSelectedDistances] = useState<string[]>([]);

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
      // If "Neutral" is selected, clear all other selections
      setSelectedItems(['Neutral']);
    } else {
      // Remove "Neutral" if another item is selected
      const filteredItems = selectedItems.filter((i) => i !== 'Neutral');
  
      if (filteredItems.includes(item)) {
        // Remove item if already selected
        setSelectedItems(filteredItems.filter((i) => i !== item));
      } else if (filteredItems.length < maxSelections) {
        // Add item if within the limit
        setSelectedItems([...filteredItems, item]);
      } else {
        alert(`You can select up to ${maxSelections} items only.`);
      }
    }
  };

  const handleSaveAndContinue = () => {
    console.log('Group ID:', groupId);

    // Find the group by ID
    const groupIndex = groups.findIndex((g) => g.id === groupId);
    if (groupIndex === -1) {
      console.error('Group not found. Available groups:', groups);
      alert('Group not found.');
      return;
    }

    // Update the "You" member's preferences
    const updatedGroups = [...groups];
    const group = updatedGroups[groupIndex];
    const memberIndex = group.members.findIndex((m) => m.name === 'You');
    if (memberIndex !== -1) {
      group.members[memberIndex].preferences = {
        interests: selectedInterests.join(', '),
        priceRange: selectedPriceRanges.join(', '),
        distance: selectedDistances.join(', '),
      };
      group.members[memberIndex].status = 'Submitted';
      console.log(`Preferences updated for "You" in group "${group.name}"`);
    } else {
      console.error(`"You" member not found in group "${group.name}"`);
    }

    // Save the updated groups persistently
    saveGroups(updatedGroups);

    // Navigate back to the Group Members screen
    router.push(`/group-members?groupId=${groupId}`);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>X</Text>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          Pick Your Preferences
        </ThemedText>
      </View>
      <ScrollView>
        <Text style={styles.description}>
          Let’s get started!{'\n'}We’ll use this info to recommend events for your group!
        </Text>
s
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
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndContinue}>
        <Text style={styles.saveButtonText}>Save and continue</Text>
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