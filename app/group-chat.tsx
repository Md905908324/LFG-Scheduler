import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router'; // Import useRouter
import { IconSymbol } from '@/components/ui/IconSymbol'; // Import IconSymbol
import { useGlobalSearchParams } from 'expo-router';

export default function GroupChatScreen() {
  const router = useRouter(); // Initialize router
  const { groupId, groupName } = useGlobalSearchParams(); // Get groupId and groupName from global search params
  const id = Array.isArray(groupId) ? groupId[0] : groupId;
  const name = Array.isArray(groupName) ? groupName[0] : groupName;
  const messages = [
    { id: '1', sender: 'John', text: 'Hey everyone!', time: '10:00 AM' },
    { id: '2', sender: 'Alice', text: 'Hi John!', time: '10:01 AM' },
    { id: '3', sender: 'You', text: 'What’s the plan for today?', time: '10:02 AM' },
  ];

  interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === 'You' && styles.myMessage]}>
      <Text style={[styles.sender, item.sender === 'You' && styles.myMessageText]}>
        {item.sender}
      </Text>
      <Text style={[styles.messageText, item.sender === 'You' && styles.myMessageText]}>
        {item.text}
      </Text>
      <Text style={[styles.time, item.sender === 'You' && styles.myMessageText]}>
        {item.time}
      </Text>
    </View>
  );

  const handleGenerateEvents = () => {
    if (id) {
      router.push(`/group-preferences?groupId=${encodeURIComponent(id)}`);
    } else {
      alert('Group ID is missing.');
    }
  };

  const handleBack = () => {
    // Navigate back to the Groups screen
    router.push('/groups');
  };

  const handleMembers = () => {
    if (id) {
      router.push(`/group-members?groupId=${encodeURIComponent(id)}`);
    } else {
      alert('Group ID is missing.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          {groupName}
        </ThemedText>
        <View>
          <TouchableOpacity style={styles.membersButton} onPress={handleMembers}>
            <IconSymbol name="person.2.fill" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#AAAAAA"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateEvents}>
        <Text style={styles.generateButtonText}>Generate Events</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#151718',
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  membersButton: {
    backgroundColor: '#151718',
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatList: {
    flexGrow: 1,
    padding: 16,
  },
  messageContainer: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#00FF00',
  },
  myMessageText: {
    color: '#000000',
  },
  sender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  time: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#151718',
  },
  input: {
    flex: 1,
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00FF00',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#00FF00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  generateButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});