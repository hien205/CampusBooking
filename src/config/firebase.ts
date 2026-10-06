import {
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';

import { getAuth } from 'firebase/auth';

import {
  getFirestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAbExLfRYujYDLQLt4P2F42sP4Tc6Qa-EI',
  authDomain: 'campusbooking-92d33.firebaseapp.com',
  projectId: 'campusbooking-92d33',
  storageBucket: 'campusbooking-92d33.firebasestorage.app',
  messagingSenderId: '381956847288',
  appId: '1:381956847288:web:5c48d0348c32ed4991664d',
  measurementId: 'G-X00C7W7E8D',
};

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export {
  app,
  auth,
  db,
};