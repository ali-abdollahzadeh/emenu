import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Your Firebase configuration object will go here
  // You'll need to copy this from your Firebase console
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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 