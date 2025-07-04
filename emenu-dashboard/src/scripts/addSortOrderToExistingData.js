const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, writeBatch } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDIqTMNaN6N3W_eE7DBWVvrl4F0xRFcCJg",
  authDomain: "emenu-b846f.firebaseapp.com",
  databaseURL: "https://emenu-b846f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "emenu-b846f",
  storageBucket: "emenu-b846f.firebasestorage.app",
  messagingSenderId: "1083411403590",
  appId: "1:1083411403590:web:249fe46f5469fd7dde0b47",
  measurementId: "G-H1ET66TY3D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addSortOrderToExistingData = async () => {
  const batch = writeBatch(db);

  try {
    // --- Update Categories ---
    console.log('Checking and updating categories sortOrder...');
    const categoriesRef = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesRef);

    categoriesSnapshot.docs.forEach((d, index) => {
      const data = d.data();
      if (data.sortOrder === undefined || data.sortOrder === null) {
        console.log(`Updating category '${data.name}' with sortOrder: ${index}`);
        batch.update(doc(db, 'categories', d.id), { sortOrder: index });
      }
    });

    // --- Update Menu Items ---
    console.log('Checking and updating menuItems sortOrder...');
    const menuItemsRef = collection(db, 'menuItems');
    const menuItemsSnapshot = await getDocs(menuItemsRef);

    menuItemsSnapshot.docs.forEach((d, index) => {
      const data = d.data();
      if (data.sortOrder === undefined || data.sortOrder === null) {
        console.log(`Updating menu item '${data.name}' with sortOrder: ${index}`);
        batch.update(doc(db, 'menuItems', d.id), { sortOrder: index });
      }
    });

    await batch.commit();
    console.log('All existing documents checked and sortOrder updated where missing.');
  } catch (error) {
    console.error('Error adding sortOrder to existing data:', error);
  }
};

addSortOrderToExistingData(); 