import firebase from "firebase/app";
import "firebase/firestore";

let firebaseConfig = {
    apiKey: "AIzaSyAs01KxIKMcQrzMPbNqTX1S8zaw3TE1Trw",
    authDomain: "covid19-61b4b.firebaseapp.com",
    databaseURL: "https://covid19-61b4b-default-rtdb.firebaseio.com",
    projectId: "covid19-61b4b",
    storageBucket: "covid19-61b4b.appspot.com",
    messagingSenderId: "956274563181",
    appId: "1:956274563181:web:869eaa24ab56a8e3f24764",
    measurementId: "G-KFJMH452QE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;