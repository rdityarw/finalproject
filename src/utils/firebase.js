// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfWZDHC9AmSJLVI42GgY1TKvHZPAk5P9k",
  authDomain: "recipe-search-platform.firebaseapp.com",
  projectId: "recipe-search-platform",
  storageBucket: "recipe-search-platform.appspot.com",
  messagingSenderId: "621085259551",
  appId: "1:621085259551:web:785a306ecae91c04c6a22a",
  measurementId: "G-SDNPZ20X2E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

const db = getFirestore(app);

export const saveSearchHistory = async (searchTerm, userId) => {
  try {
    // Validasi: Pastikan searchTerm tidak kosong
    if (!searchTerm.trim()) {
      console.log("Invalid searchTerm. It cannot be empty.");
      return;
    }

    // Ubah seluruh searchTerm menjadi huruf kecil
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Check if the lowerCaseSearchTerm already exists for the userId
    const q = query(
      collection(db, "searchHistory"),
      where("searchTerm", "==", lowerCaseSearchTerm),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    // If the document with the lowerCaseSearchTerm and userId exists, do nothing
    if (!querySnapshot.empty) {
      console.log("Document already exists for this searchTerm and userId");
      return;
    }

    // If the document doesn't exist and searchTerm is not empty, add it
    const docRef = await addDoc(collection(db, "searchHistory"), {
      searchTerm: lowerCaseSearchTerm, // Simpan sebagai huruf kecil
      originalSearchTerm: searchTerm, // Simpan versi asli jika diperlukan
      timestamp: new Date(),
      userId: userId,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error checking or adding document: ", e);
  }
};

export const getSearchHistoryByUserId = async (userId) => {
  try {
    const q = query(
      collection(db, "searchHistory"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  } catch (error) {
    console.error("Error fetching search history:", error);
    throw error;
  }
};
