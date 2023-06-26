import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage }  from 'firebase/storage'

// import dotenv from 'dotenv';

// dotenv.config();
// console.log(import.meta.env.VITE_APIKEY)

// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_APIKEY,
//     authDomain: import.meta.env.VITE_AUTHDOMAIN,
//     projectId: import.meta.env.VITE_PROJECTID,
//     storageBucket: import.meta.env.VITE_STORAGEBUCKET,
//     messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
//     appId: import.meta.env.VITE_APPID,
//     measurementId: import.meta.env.VITE_MEASUREMENTID
// };

const firebaseConfig = {
    apiKey: 'AIzaSyCoPZi47yVsJO5h7npnRApejG6Ecy2B0KU',
    authDomain: 'trello-clone-typescript-fd86c.firebaseapp.com',
    projectId: 'trello-clone-typescript-fd86c',
    storageBucket: 'trello-clone-typescript-fd86c.appspot.com',
    messagingSenderId: '89932851373',
    appId: '1:89932851373:web:d957c092d0faf0cf513e24',
    measurementId: 'G-X6P1KDF9BE'
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const storage = getStorage(app)

export const db = getFirestore(app)