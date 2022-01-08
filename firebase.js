import firebase  from "firebase";

const firebaseConfig = {
  apiKey: process.env.API_KEY
   ,
  authDomain: "fir-c33ad.firebaseapp.com",
  projectId: "fir-c33ad",
  storageBucket: "fir-c33ad.appspot.com",
  messagingSenderId: "128072788204",
  appId: "1:128072788204:web:28fe607b55c44488f01dc9"
};
const app = ! firebase.apps.length ? firebase.initializeApp(firebaseConfig) 
: firebase.app();

const db = app.firestore();
export default db;