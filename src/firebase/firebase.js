import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDO9oQr6TgMzIxsB4ucf3AcY_dfBpqTnwM",
    authDomain: "kodegram-dde03.firebaseapp.com",
    projectId: "kodegram-dde03",
    storageBucket: "kodegram-dde03.appspot.com",
    messagingSenderId: "156624202219",
    appId: "1:156624202219:web:d3147c8677f8c848be91ae"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();