import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAA8pXhHfubiOlBBPzfdH7lo3DbK7W8pMM",
  authDomain: "movieapp-7ecf4.firebaseapp.com",
  databaseURL: 'https://movieapp-7ecf4-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: "movieapp-7ecf4",
  storageBucket: "movieapp-7ecf4.appspot.com",
  messagingSenderId: "879116522427",
  appId: "1:879116522427:web:e87f7777ce088e41c4ea9e"
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { auth };

export const db = getDatabase(app);
