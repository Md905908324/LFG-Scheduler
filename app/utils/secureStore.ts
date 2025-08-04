import * as SecureStore from 'expo-secure-store';

export async function saveToSecureStore(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving data to SecureStore with key "${key}":`, error);
  }
}

export async function getFromSecureStore(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error retrieving data from SecureStore with key "${key}":`, error);
    return null;
  }
}

export default {}; // Add a default export to avoid errors