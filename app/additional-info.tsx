import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function AdditionalInfoScreen() {
  const router = useRouter();

  // State variables for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState('');

  const handleContinue = () => {
    // Validate that all fields are filled
    if (!firstName || !lastName || !displayName || !dob) {
      Alert.alert('Incomplete Information', 'Please fill out all fields before continuing.');
      return;
    }

    // Navigate to the home screen in the tabs layout
    console.log('Additional information submitted:', { firstName, lastName, displayName, dob });
    router.replace('/home'); // Navigate to the home screen
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Additional Information
      </ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#AAAAAA"
          autoCapitalize="words"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#AAAAAA"
          autoCapitalize="words"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Display Name"
          placeholderTextColor="#AAAAAA"
          autoCapitalize="words"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          style={styles.input}
          placeholder="DOB (MM/DD/YYYY)"
          placeholderTextColor="#AAAAAA"
          keyboardType="numeric"
          value={dob}
          onChangeText={setDob}
        />
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 64,
    backgroundColor: '#151718',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#00FF00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});