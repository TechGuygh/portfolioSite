import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, EmailAuthProvider } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  getDocFromServer,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
// Note: set_up_firebase tool provisioned a specific database instance
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Validates connection to Firestore.
 * If this fails with "the client is offline", check Firebase configuration.
 */
async function testConnection() {
  try {
    // Attempting to read a dummy document to verify connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase Connection Error: The client is offline. Please check your Firebase configuration and internet connection.");
    }
  }
}
testConnection();

export {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  increment,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider
};
