import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0e1vZag5IzvpI87WMuuyAhaE19pAzas4",
  authDomain: "ponto-ze.firebaseapp.com",
  projectId: "ponto-ze",
  storageBucket: "ponto-ze.firebasestorage.app",
  messagingSenderId: "144954265214",
  appId: "1:144954265214:web:abfb743c53e0b8fdf4922f"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);