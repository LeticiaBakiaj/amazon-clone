// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyC6tUxGCnByJVXst2JL5z0zx1s_-sCD5QI",
    authDomain: "clone-252cc.firebaseapp.com",
    databaseURL: "https://clone-252cc.firebaseio.com",
    projectId: "clone-252cc",
    storageBucket: "clone-252cc.appspot.com",
    messagingSenderId: "553926661670",
    appId: "1:553926661670:web:78514c183744b9767e78e7",
    measurementId: "G-Y25JY4W2W7"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };