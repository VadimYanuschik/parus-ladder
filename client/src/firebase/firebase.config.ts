// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCH-0aZhmYpBuAvfy8DfMXWuVmsH5kMa6U",
    authDomain: "parus-ladder-da836.firebaseapp.com",
    projectId: "parus-ladder-da836",
    storageBucket: "parus-ladder-da836.appspot.com",
    messagingSenderId: "389886617531",
    appId: "1:389886617531:web:560ceb19017a6badb3069e",
    measurementId: "G-H8EHGVDHBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
