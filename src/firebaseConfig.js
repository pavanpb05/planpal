// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAWalOPQy1qCuxKhJjSBV2bcYO7sjOMb4",
  authDomain: "planpal-ec8e2.firebaseapp.com",
  projectId: "planpal-ec8e2",
  storageBucket: "planpal-ec8e2.firebasestorage.app",
  messagingSenderId: "885742933420",
  appId: "1:885742933420:web:fd6942fa56f253e4b25609",
  measurementId: "G-EFJX04SZ6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
export const storage = getStorage(app);

export {app, db};