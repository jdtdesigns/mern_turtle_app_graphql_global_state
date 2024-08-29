import { Navigate, useLocation } from 'react-router-dom'

import { useStore } from '../store'

function Protect(props) {
  const location = useLocation()
  const { state } = useStore()

  if (!state.loading) {
    if (props.requireAuth && !state.user) {
      return <Navigate to="/auth" />
    }

    if (props.requireAuth && state.user) {
      return props.children
    }

    if (!props.requireAuth && state.user && location.pathname.includes('auth')) {
      return <Navigate to="/dashboard" />
    }

    if (!props.requireAuth && !state.user) {
      return props.children
    }
  }

}

export default Protect