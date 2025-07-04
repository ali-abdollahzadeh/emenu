// @ts-nocheck
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { categories } from './categories';
import { foodItems } from './foodItems';

const uploadInitialData = async () => {
  try {
    // Clear existing data
    const menuItemsSnapshot = await getDocs(collection(db, 'menuItems'));
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));

    // Delete existing menu items
    for (const doc of menuItemsSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Delete existing categories
    for (const doc of categoriesSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Upload new categories
    for (const category of categories) {
      await addDoc(collection(db, 'categories'), category);
    }

    // Upload new menu items
    for (const item of foodItems) {
      await addDoc(collection(db, 'menuItems'), item);
    }
  } catch (error) {
    console.error('Error uploading data:', error);
  }
};

// Run the upload
uploadInitialData(); 