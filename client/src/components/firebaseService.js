
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDsltMBOxgB_01xopEmTyq_PXth7yMHPag",
  authDomain: "finaldart-86b8d.firebaseapp.com",
  databaseURL: "https://finaldart-86b8d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "finaldart-86b8d",
  storageBucket: "finaldart-86b8d.appspot.com",
  messagingSenderId: "1001125044077",
  appId: "1:1001125044077:web:b112be3376d17813080464",
  measurementId: "G-X2CNCX09E8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
