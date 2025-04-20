// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAADCV5vjuFG-LyzP5mmU67ghtKTK7U7M0",
  authDomain: "site-prata.firebaseapp.com",
  projectId: "site-prata",
  storageBucket: "site-prata.appspot.com",
  messagingSenderId: "981756838479",
  appId: "1:981756838479:web:76c8a204d3dbeb9542a03a",
  measurementId: "G-ESGFHH83LP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportando instâncias dos serviços Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);