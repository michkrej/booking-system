import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyB-SrkGvE90xmL6i7KcR4GbLoGden3KYwk',
    authDomain: 'booking-system-1377d.firebaseapp.com',
    projectId: 'booking-system-1377d',
    storageBucket: 'booking-system-1377d.appspot.com',
    messagingSenderId: '193135357886',
    appId: '1:193135357886:web:3a0aede71cb382bfb3d3ef',
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore()

export default firebase
