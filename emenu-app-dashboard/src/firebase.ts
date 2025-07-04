import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore database instance
export const db = getFirestore(app); 