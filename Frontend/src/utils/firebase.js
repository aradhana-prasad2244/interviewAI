import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewai-62302.firebaseapp.com",
  projectId: "interviewai-62302",
  storageBucket: "interviewai-62302.firebasestorage.app",
  messagingSenderId: "270798728458",
  appId: "1:270798728458:web:2ee7e1d52b8a7992e31ef3"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth, provider}