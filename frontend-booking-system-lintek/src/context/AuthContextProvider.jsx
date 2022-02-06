import { createContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { auth, firestore } from '../firebase/config'

export const AuthContext = createContext()
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: undefined }
    case 'AUTH_READY':
      return { ...state, user: action.payload, authFinished: true }
    default:
      return state
  }
}

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: undefined,
    authFinished: false
  })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log(user)
      if (user) {
        const dataRes = []
        const ref = firestore.collection('userDetails')
        const data = await ref.where('userId', '==', user.uid).get()
        data.docs.forEach((doc) => dataRes.push(doc.data()))
        if (dataRes.length > 0) {
          dispatch({
            type: 'AUTH_READY',
            payload: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              committeeId: dataRes[0].committeeId
            }
          })
        }
      } else {
        dispatch({
          type: 'AUTH_READY',
          payload: undefined
        })
      }

      unsubscribe()
    })
  }, [])

  console.log(state)
  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>
}

AuthContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}
export default AuthContextProvider
