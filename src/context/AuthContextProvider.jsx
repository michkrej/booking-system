import { createContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { auth, db } from '../firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // console.log(user)
      if (user) {
        const dataRes = []
        const q = query(collection(db, 'userDetails'), where('userId', '==', user.uid))
        const data = await getDocs(q)
        data.docs.forEach((doc) => dataRes.push(doc.data()))
        if (dataRes.length > 0) {
          dispatch({
            type: 'AUTH_READY',
            payload: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              committeeId: dataRes[0].committeeId,
              admin: dataRes[0].admin ?? false
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

  // console.log(state)
  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>
}

AuthContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
}
export default AuthContextProvider
