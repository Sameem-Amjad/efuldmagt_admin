// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA2JwexFnZr8KUR60QaKc3mTZhBYVIWzQ",
  authDomain: "my-project-38bb3.firebaseapp.com",
  projectId: "my-project-38bb3",
  storageBucket: "my-project-38bb3.appspot.com",
  messagingSenderId: "446220935169",
  appId: "1:446220935169:web:76074c7481ee8c46106000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };