import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXjDmwpHRK0cdFwEWtssJRgwBR6zRLyU0",
  authDomain: "it-sysarch32-store-trapero.firebaseapp.com",
  projectId: "it-sysarch32-store-trapero",
  storageBucket: "it-sysarch32-store-trapero.appspot.com",
  messagingSenderId: "769868410997",
  appId: "1:769868410997:web:f29ba74e3099184e17483c",
  measurementId: "G-WRBJZ519QC"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);