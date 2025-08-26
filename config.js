// Configuration file for Email Sender
// Replace the placeholder values with your actual credentials

// Firebase Configuration
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBpistqkn02kHLsCl9zW_i-yrIAOm3RJuQ",
    authDomain: "neo-mail.firebaseapp.com",
    projectId: "neo-mail",
    storageBucket: "neo-mail.firebasestorage.app",
    messagingSenderId: "411777412645",
    appId: "1:411777412645:web:cfe3dc574ace50e6e3d9cc",
    measurementId: "G-6XYZXSQE1D"
};

// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: "8nV8GppQ82RWajpEo", // ✅ Already updated!
    serviceID: "service_p3qhlgl",     // ✅ Service ID
    templateID: "template_ty833ys"    // ✅ Template ID (fixed typo)
};

// Export configurations
window.FIREBASE_CONFIG = FIREBASE_CONFIG;
window.EMAILJS_CONFIG = EMAILJS_CONFIG; 