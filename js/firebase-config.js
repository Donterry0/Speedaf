// js/firebase-config.js
// Using compat version so it matches the rest of the demo code

// This is the compat / namespace way (v8-style)
const firebaseConfig = {
  apiKey:            "AIzaSyAZ-bF3j_FE7Doq81h0XJjS52CEJ8g5SYo",
  authDomain:        "creditafinity.firebaseapp.com",
  projectId:         "creditafinity",
  storageBucket:     "creditafinity.firebasestorage.app",
  messagingSenderId: "275636699713",
  appId:             "1:275636699713:web:82f042d61fc7d0c55cbcc0",
  measurementId:     "G-Q9SNBGVZPD"
};

// Initialize Firebase (compat style)
firebase.initializeApp(firebaseConfig);

// Make these globally available (this matches the demo code)
const auth = firebase.auth();
const db   = firebase.firestore();

// Optional: analytics (you can remove if you don't need it)
const analytics = firebase.analytics();

console.log("Firebase initialized successfully (compat mode)");
