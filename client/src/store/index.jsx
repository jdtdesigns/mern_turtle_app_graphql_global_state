import { useState, useEffect, useContext, createContext } from 'react'
import { useQuery } from '@apollo/client'

import { GET_USER } from '../graphql/queries'

const StoreContext = createContext()

const initialState = {
  user: null,
  loading: true
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(initialState)
  const { loading, data } = useQuery(GET_USER)

  useEffect(() => {
    if (!loading && data) {

      setState({
        ...state,
        user: data.getUser.user,
        loading: false
      })
    }
  }, [data])

  return (
    <StoreContext.Provider value={{
      state,
      setState
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)