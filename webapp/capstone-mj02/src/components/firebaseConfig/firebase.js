import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKX5dsAkfol8OARdRL7KdNASDZSKldM70",
  authDomain: "home-iot-network.firebaseapp.com",
  databaseURL: "https://home-iot-network-default-rtdb.firebaseio.com",
  projectId: "home-iot-network",
  storageBucket: "home-iot-network.appspot.com",
  messagingSenderId: "109909206437",
  appId: "1:109909206437:web:8ac23b4489998a1aebb44c",
  measurementId: "G-0CDNZNVNZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

      export const db = getDatabase(app);