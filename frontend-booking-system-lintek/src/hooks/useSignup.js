import React, { useState } from 'react'
import { auth, firestore } from '../firebase/config'

const useSignup = () => {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState()

    const signup = async (email, password, displayName, commitee) => {
        setError(undefined)
        setIsPending(true)
        try {
            const res = await auth.createUserWithEmailAndPassword(
                email,
                password
            )
            console.log(res.user)

            if (!res) {
                throw new Error('Could not create user')
            }

            await res.user.updateProfile({ displayName })
            await firestore.collection('userDetails').add({
                commitee,
                userId: res.user.uid,
            })
        } catch (error) {
            console.log(error.message)
            setError(err.message)
            setIsPending(false)
        }
    }

    return { error, isPending, signup }
}

export default useSignup
