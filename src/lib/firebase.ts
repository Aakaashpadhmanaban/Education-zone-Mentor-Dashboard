import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQ45u8f1J-_0PCs2GmoklDbQon25sdWTw",
  authDomain: "mentor-dashboard-51afd.firebaseapp.com",
  projectId: "mentor-dashboard-51afd",
  storageBucket: "mentor-dashboard-51afd.firebasestorage.app",
  messagingSenderId: "809612338436",
  appId: "1:809612338436:web:aba4ccc3156365a2ae1c51",
};

// Ensure we don't initialize more than once in dev with HMR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore singleton
const db = getFirestore(app);

export { app, db };

// Convenience re-exports for Firestore APIs
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
};
