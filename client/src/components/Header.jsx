import { NavLink, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'

import { useStore } from '../store'

import { LOGOUT_USER } from '../graphql/mutations'

function Header() {
  const { state, setState } = useStore()
  const navigate = useNavigate()
  const [logoutUser] = useMutation(LOGOUT_USER)

  const handleLogout = async () => {
    await logoutUser()
    await setState(oldState => ({
      ...oldState,
      user: null
    }))

    navigate('/')
  }

  return (
    <header className="row justify-between align-center">
      <NavLink to="/">
        <h3>Cowabunga</h3>
      </NavLink>

      {state.user ? (
        <div className="row align-center">
          <p>Welcome, {state.user.username}</p>

          <NavLink className="dashboard-link" to="/dashboard">Dashboard</NavLink>

          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/auth">Log In or Register</NavLink>
        </nav>
      )}
    </header>
  )
}

export default Header