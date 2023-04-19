/* eslint-disable no-undef */
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = /* window.location.hostname == 'localhost'
    ? {
        apiKey: process.env.REACT_APP_DEV_API,
        authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_DEV_PROJECT_ID,
        storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_DEV_APP_ID
      }
    : */ {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_ANALYTICS_ID
}

const app = initializeApp(firebaseConfig)

export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
