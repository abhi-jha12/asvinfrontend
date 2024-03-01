import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5fiSq6r0fMRrLOwjbGqohHiPppLC4WI0",
  authDomain: "backasvin.firebaseapp.com",
  projectId: "backasvin",
  storageBucket: "backasvin.appspot.com",
  messagingSenderId: "6226011431",
  appId: "1:6226011431:web:ccd9b6730cc1eaf3517502",
  measurementId: "G-BLF2CHE1LJ"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
