import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCX0YuPxqpttPs5J5_YPxkcYKf3dLNZLEU",
  authDomain: "asvintech-46912.firebaseapp.com",
  projectId: "asvintech-46912",
  storageBucket: "asvintech-46912.appspot.com",
  messagingSenderId: "87111723230",
  appId: "1:87111723230:web:1fb19ba2b54ca320f03a4f",
  measurementId: "G-HE6MESSFSZ"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };