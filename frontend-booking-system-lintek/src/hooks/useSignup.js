import React, { useState } from 'react'
import { auth, firestore } from '../firebase/config'
import useAuthContext from './useAuthContext'

const useSignup = () => {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState()
    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName, commitee) => {
        setError(undefined)
        setIsPending(true)
        try {
            const res = await auth.createUserWithEmailAndPassword(
                email,
                password
            )

            if (!res) {
                throw new Error('Could not create user')
            }

            await res.user.updateProfile({ displayName })
            await firestore.collection('userDetails').add({
                commitee,
                userId: res.user.uid,
            })

            dispatch({
                type: 'LOGIN',
                payload: {
                    displayName: res.user.displayName,
                    email: res.user.email,
                    emailVerified: res.user.emailVerified,
                    commitee,
                },
            })
        } catch (error) {
            console.log(error.message)
            setError(error.message)
            setIsPending(false)
        }
    }

    return { error, isPending, signup }
}

export default useSignup
