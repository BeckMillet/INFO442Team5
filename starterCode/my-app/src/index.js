import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

var firebaseConfig = {
  apiKey: "AIzaSyBeBjtmzMFaaWS2r5dKsrvkatUZQ2KpqC8",
  authDomain: "sprout-4f5e8.firebaseapp.com",
  databaseURL: "https://sprout-4f5e8.firebaseio.com",
  projectId: "sprout-4f5e8",
  storageBucket: "sprout-4f5e8.appspot.com",
  messagingSenderId: "1077727576738",
  appId: "1:1077727576738:web:7b3754d05af02a90b28dfb"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
