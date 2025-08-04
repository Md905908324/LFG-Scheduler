import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { usePersistentData, Group } from '@/app/data/data';

export default function GroupsScreen() {
  const router = useRouter();
  const { groups, saveGroups } = usePersistentData(); // Use persistent data hook
  const [manageMode, setManageMode] = useState(false); // Toggle manage mode
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null); // Track which group is being edited
  const [editedName, setEditedName] = useState(''); // Track the new name for the group

  // Add a new group
  const addGroup = () => {
    const newGroup: Group = {
      id: (groups.length + 1).toString(),
      name: 'New Group',
      members: [], // New groups start with no members
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
    };
    saveGroups([...groups, newGroup]); // Save the updated groups to SecureStore
  };

  // Update an existing group
  const updateGroup = (id: string, updatedData: Partial<Group>) => {
    const updatedGroups = groups.map((group) =>
      group.id === id ? { ...group, ...updatedData } : group
    );
    saveGroups(updatedGroups); // Save the updated groups to SecureStore
  };

  // Remove a group
  const removeGroup = (id: string) => {
    const updatedGroups = groups.filter((group) => group.id !== id);
    saveGroups(updatedGroups); // Save the updated groups to SecureStore
  };

  // Toggle manage mode
  const toggleManageMode = () => {
    setManageMode((prev) => !prev);
    setEditingGroupId(null); // Reset editing state when toggling manage mode
  };

  // Render a single group
  const renderGroup = ({ item }: { item: Group }) => {
    const isEditing = editingGroupId === item.id;

    return (
      <View style={styles.groupContainer}>
        <View style={styles.groupDetails}>
          {isEditing ? (
            <TextInput
              style={styles.groupNameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter group name"
              placeholderTextColor="#AAAAAA"
            />
          ) : (
            <>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupMembers}>{item.members.length} members</Text>
            </>
          )}
        </View>
        {!manageMode && (
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() =>
              router.push(`/group-chat?groupId=${encodeURIComponent(item.id)}&groupName=${encodeURIComponent(item.name)}`)
            }
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        )}
        {manageMode && (
          <View style={styles.manageButtonsContainer}>
            {isEditing ? (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  updateGroup(item.id, { name: editedName });
                  setEditingGroupId(null); // Exit editing mode
                }}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingGroupId(item.id); // Enter editing mode
                  setEditedName(item.name); // Set the current name as the initial value
                }}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeGroup(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Groups
      </ThemedText>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
        contentContainerStyle={styles.groupList}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.manageButton} onPress={toggleManageMode}>
          <Text style={styles.manageButtonText}>
            {manageMode ? 'Done Managing' : 'Manage Groups'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createGroupButton} onPress={addGroup}>
          <Text style={styles.createGroupButtonText}>Create a group</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    paddingBottom: 80,
    backgroundColor: '#151718',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  groupList: {
    flexGrow: 1,
    gap: 16,
    paddingBottom: 16,
  },
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 8,
    flexWrap: 'wrap',
  },
  groupDetails: {
    flex: 1,
    marginRight: 8,
  },
  groupName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  groupMembers: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  groupNameInput: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#444444',
    padding: 8,
    borderRadius: 8,
  },
  viewButton: {
    backgroundColor: '#444444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  manageButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#00FF00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  footer: {
    marginTop: 16,
    paddingBottom: 16,
  },
  manageButton: {
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createGroupButton: {
    backgroundColor: '#00FF00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createGroupButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});