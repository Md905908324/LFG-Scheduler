import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

// Initialize the database
export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!db) {
      console.log('Opening database...');
      db = await SQLite.openDatabase({ name: 'app.db', location: 'default' });
      console.log('Database opened successfully.');
    }

    await db.transaction((tx) => {
      console.log('Creating tables...');

      // Create Members Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          status TEXT NOT NULL,
          link INTEGER NOT NULL
        );`,
        [],
        () => console.log('Members table created successfully.'),
        (tx, error) => {
          console.error('Error creating Members table:', error);
          return false;
        }
      );

      // Insert default members
      tx.executeSql(
        `INSERT OR IGNORE INTO members (id, name, status, link) VALUES
          (1, 'You', 'Submit Your Preferences', 1),
          (2, 'John', 'Submitted', 0),
          (3, 'Alice', 'Unsubmitted', 0),
          (4, 'Evan', 'Submitted', 0),
          (5, 'Maria', 'Unsubmitted', 0);`,
        [],
        () => console.log('Default members inserted successfully.'),
        (tx, error) => {
          console.error('Error inserting default members:', error);
          return false;
        }
      );

      // Create Groups Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS groups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          members INTEGER NOT NULL
        );`
      );

      // Insert default groups
      tx.executeSql(
        `INSERT OR IGNORE INTO groups (id, name, members) VALUES
          (1, 'East Brunswick Bowling Club', 3),
          (2, 'lets play smth', 5),
          (3, 'casual stuff in nj', 3);`
      );

      // Create Events Table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          time TEXT NOT NULL,
          date TEXT NOT NULL
        );`
      );

      // Insert default events
      tx.executeSql(
        `INSERT OR IGNORE INTO events (id, title, time, date) VALUES
          (1, 'Modern Art Museum Tour', 'Mon, 9:00 AM - 11:00 AM', '2025-03-03'),
          (2, 'Bowling Tournament at Bowlero', 'Fri, 6:30 PM - 8:30 PM', '2025-03-07'),
          (3, 'Manhattan Escape Room (Hard)', 'Tue, 8:00 PM - 9:00 PM', '2025-03-10');`
      );
    });

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Fetch all members
export const fetchMembers = async (): Promise<any[]> => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM members',
        [],
        (tx, results) => {
          const rows = results.rows;
          const members = [];
          for (let i = 0; i < rows.length; i++) {
            members.push(rows.item(i));
          }
          console.log('Fetched members:', members); // Debugging
          resolve(members);
        },
        (tx, error) => {
          console.error('Error fetching members:', error);
          reject(error);
        }
      );
    });
  });
};

// Add a new member
export const addMember = async (
  name: string,
  status: string,
  link: boolean
): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO members (name, status, link) VALUES (?, ?, ?)',
        [name, status, link ? 1 : 0],
        () => {
          console.log(`Member "${name}" added successfully.`);
          resolve();
        },
        (tx, error) => {
          console.error('Error adding member:', error);
          reject(error);
        }
      );
    });
  });
};

// Fetch all groups
export const fetchGroups = async (): Promise<any[]> => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM groups',
        [],
        (tx, results) => {
          const rows = results.rows;
          const groups = [];
          for (let i = 0; i < rows.length; i++) {
            groups.push(rows.item(i));
          }
          console.log('Fetched groups:', groups); // Debugging
          resolve(groups);
        },
        (tx, error) => {
          console.error('Error fetching groups:', error);
          reject(error);
        }
      );
    });
  });
};

// Add a new group
export const addGroup = async (name: string, members: number): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO groups (name, members) VALUES (?, ?)',
        [name, members],
        () => {
          console.log(`Group "${name}" added successfully.`);
          resolve();
        },
        (tx, error) => {
          console.error('Error adding group:', error);
          reject(error);
        }
      );
    });
  });
};

// Fetch all events
export const fetchEvents = async (): Promise<any[]> => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM events',
        [],
        (tx, results) => {
          const rows = results.rows;
          const events = [];
          for (let i = 0; i < rows.length; i++) {
            events.push(rows.item(i));
          }
          console.log('Fetched events:', events); // Debugging
          resolve(events);
        },
        (tx, error) => {
          console.error('Error fetching events:', error);
          reject(error);
        }
      );
    });
  });
};

// Add a new event
export const addEvent = async (
  title: string,
  time: string,
  date: string
): Promise<void> => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO events (title, time, date) VALUES (?, ?, ?)',
        [title, time, date],
        () => {
          console.log(`Event "${title}" added successfully.`);
          resolve();
        },
        (tx, error) => {
          console.error('Error adding event:', error);
          reject(error);
        }
      );
    });
  });
};