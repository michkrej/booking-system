/* eslint-disable no-undef */
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/app-check'

if (window.location.hostname == 'localhost') self.FIREBASE_APPCHECK_DEBUG_TOKEN = true

const firebaseConfig =
  window.location.hostname == 'localhost'
    ? {
        apiKey: process.env.REACT_APP_DEV_API,
        authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_DEV_PROJECT_ID,
        storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_DEV_APP_ID
      }
    : {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_ANALYTICS_ID
      }

firebase.initializeApp(firebaseConfig)

export const analytics = firebase.analytics()
export const auth = firebase.auth()
export const firestore = firebase.firestore()

export default firebase
