import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router'; // Import useRouter
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for clearing cache

export default function LoginScreen() {
  const router = useRouter(); // Initialize router from expo-router

  // State variables for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to clear cache
  const clearCache = async () => {
    try {
      await SecureStore.deleteItemAsync('groups');
      await SecureStore.deleteItemAsync('importedEvents');
      console.log('Cache cleared successfully.');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const handleLogin = async () => {
    // Validate that all fields are filled
    if (!email || !password) {
      Alert.alert('Incomplete Information', 'Please fill out all fields before continuing.');
      return;
    }

    // Simulate login logic (replace with actual API call or validation)
    console.log('Login button pressed with:', { email, password });

    // Clear cache after successful login
    await clearCache();

    // Navigate to the home screen
    router.replace('/home');
  };

  const handleSignUp = () => {
    // Navigate to the sign-up screen
    console.log('Sign-up link pressed');
    router.push('/signup');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to Real LFG!
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signUpText}>
          Don’t have an account? <Text style={styles.signUpLink}>Sign up</Text>
        </Text>
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
  buttonContainer: {
    marginBottom: 24,
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
  signUpText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
  signUpLink: {
    color: '#00FF00',
    fontWeight: 'bold',
  },
});