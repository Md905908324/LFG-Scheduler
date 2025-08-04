import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useGlobalSearchParams } from 'expo-router'; // Use global search params
import { usePersistentData, Group, Member } from '@/app/data/data';

export default function GroupMembersScreen() {
  const router = useRouter();
  const { groupId } = useGlobalSearchParams(); // Get the group ID from global search parameters
  const id = Array.isArray(groupId) ? groupId[0] : groupId; // Ensure groupId is a string
  const { groups, saveGroups } = usePersistentData(); // Use persistent data hook
  const [group, setGroup] = useState<Group | null>(null); // Store the current group
  const [newMemberName, setNewMemberName] = useState('');

  useEffect(() => {
    // Fetch the group by ID
    const selectedGroup = groups.find((g) => g.id === id);
    if (selectedGroup) {
      setGroup(selectedGroup);
    }
  }, [id, groups]);

  const addMember = () => {
    if (!group) return;
    if (newMemberName.trim() === '') {
      alert('Please enter a valid name.');
      return;
    }
    const newMember: Member = {
      id: (group.members.length + 1).toString(),
      name: newMemberName,
      status: 'Unsubmitted',
      link: false,
    };
    const updatedGroup = {
      ...group,
      members: [...group.members, newMember],
    };
    const updatedGroups = groups.map((g) => (g.id === group.id ? updatedGroup : g));
    saveGroups(updatedGroups); // Save the updated groups to persistent storage
    setGroup(updatedGroup); // Update the local group state
    setNewMemberName(''); // Clear the input field
  };

  if (!group) {
    return (
      <ThemedView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorText}>Group not found.</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const totalMembers = group.members.length;
  const readyMembers = group.members.filter((member) => member.status === 'Submitted').length;

  const renderMember = ({ item }: { item: Member }) => (
    <View style={styles.memberContainer}>
      <View style={styles.avatar} />
      <View style={styles.memberDetails}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text
          style={[
            styles.statusText,
            item.status === 'Submitted' ? styles.submitted : styles.unsubmitted,
          ]}
        >
          {item.status}
        </Text>
      </View>
      {item.name === 'You' && (
        <TouchableOpacity
          style={styles.editPreferencesButton}
          onPress={() => router.push(`/your-preferences?groupId=${encodeURIComponent(id)}`)}
        >
          <Text style={styles.editPreferencesButtonText}>Edit Preferences</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push(`/group-chat?groupId=${encodeURIComponent(id)}`)}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          {group.name}
        </ThemedText>
      </View>
      <Text style={styles.subTitle}>
        {totalMembers} Members, {readyMembers} Ready
      </Text>
      <FlatList
        data={group.members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={styles.memberList}
      />
      <View style={styles.addMemberContainer}>
        <TextInput
          style={styles.addMemberInput}
          value={newMemberName}
          onChangeText={setNewMemberName}
          placeholder="Enter member name"
          placeholderTextColor="#AAAAAA"
        />
        <TouchableOpacity style={styles.addMemberButton} onPress={addMember}>
          <Text style={styles.addMemberButtonText}>Add Member</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#151718',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  subTitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 16,
    textAlign: 'center',
  },
  memberList: {
    flexGrow: 1,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#AAAAAA',
    marginRight: 16,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
  },
  submitted: {
    color: '#00FF00',
  },
  unsubmitted: {
    color: '#FFA500',
  },
  editPreferencesButton: {
    backgroundColor: '#00FFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  editPreferencesButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  addMemberInput: {
    flex: 1,
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  addMemberButton: {
    backgroundColor: '#00FF00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addMemberButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});