import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZfijy6KTujZxw4Ha6x1pp_LOF-DczzPc",
  authDomain: "react-native-app-2822b.firebaseapp.com",
  projectId: "react-native-app-2822b",
  storageBucket: "react-native-app-2822b.firebasestorage.app",
  messagingSenderId: "21273477339",
  appId: "1:21273477339:web:e933278761884739d8ccfe",
  measurementId: "G-T17GCLWKJ5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);