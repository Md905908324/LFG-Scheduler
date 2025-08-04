import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SignupScreen() {
  const router = useRouter();

  // State variables for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // Validate that all fields are filled
    if (!email || !password) {
      Alert.alert('Incomplete Information', 'Please fill out all fields before continuing.');
      return;
    }

    // Add account creation logic here (e.g., API call)
    console.log('Account creation logic goes here with:', { email, password });
    router.push('/additional-info'); // Navigate to the additional info screen
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create Account
      </ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#AAAAAA"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#AAAAAA"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleSignup}>
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