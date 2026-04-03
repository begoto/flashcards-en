import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAC0VRdOa5dwO5pM7jIKUUM6cPhz-VwREo",
  authDomain: "flashcards-en-1b1fd.firebaseapp.com",
  projectId: "flashcards-en-1b1fd",
  storageBucket: "flashcards-en-1b1fd.firebasestorage.app",
  messagingSenderId: "32636794363",
  appId: "1:32636794363:web:579e613d539ad6b487075e"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);