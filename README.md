# LFG Scheduler 📅

The **LFG Scheduler** is a React Native app built with [Expo](https://expo.dev) to help users organize and manage group events efficiently. With features like calendar integration, group chats, and event recommendations, this app makes scheduling fun and easy. This is a part of Real LFG's core features and created by Matthew Ding.

To test the code, do npm install and npx expo start to create an Expo Go instance.
---

## **Features**

### **1. Calendar Integration**
- Import `.ics` files to populate your calendar with events.
- View events for specific dates with highlighted markers.
- Manage events directly from the calendar.

### **2. Group Management**
- Create and manage groups with ease.
- View group members and their statuses (e.g., "Submitted", "Unsubmitted").
- Navigate to group-specific chats and preferences.

### **3. Group Chat**
- Chat with group members in real-time.
- View messages with sender details and timestamps.
- Send and receive messages in a clean, themed interface.

### **4. Event Recommendations**
- Get personalized event recommendations based on group preferences.
- View event details like title, address, rating, and cost.
- Regenerate results or edit group preferences for better recommendations.

---

## **Project Structure**

### **Key Files and Features**
- **`app/(tabs)/home.tsx`**:
  - Displays the calendar and events for selected dates.
  - Allows users to import `.ics` files to populate the calendar.
- **`app/group-chat.tsx`**:
  - Group-specific chat interface with message history and input.
  - Includes navigation to group members and preferences.
- **`app/group-members.tsx`**:
  - Displays a list of group members with their statuses.
  - Allows navigation to submit preferences for the current user.
- **`app/event-recommendation.tsx`**:
  - Displays event recommendations based on group preferences.
  - Includes options to regenerate results or edit preferences.
- **`app/(tabs)/groups.tsx`**:
  - Lists all groups with member counts.
  - Allows navigation to group-specific chats.

---

## **License**

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).