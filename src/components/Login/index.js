import {useState, useContext} from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'
import NxtContext from '../../context/NxtContext'
import {LoginContainer} from '../../Style'

import './index.css'

const Login = () => {
  const history = useHistory()
  const {darkTheme} = useContext(NxtContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showError, setShowError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  const handleFailure = error => {
    setShowError(true)
    setErrorMsg(error)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const options = {
      method: 'POST',
      body: JSON.stringify({username, password}),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const responseData = await response.json()

    if (response.ok) {
      handleSuccess(responseData.jwt_token)
    } else {
      handleFailure(responseData.error_msg)
    }
  }

  const handleUsername = event => {
    setUsername(event.target.value)
  }

  const handlePassword = event => {
    setPassword(event.target.value)
  }

  const handleCheckbox = () => {
    setShowPassword(prevState => !prevState)
  }

  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <LoginContainer darkTheme={darkTheme}>
      <div className="left-container">
        <img
          src="https://res.cloudinary.com/dq4yjeejc/image/upload/v1727266763/4957136_ym8bwt.jpg"
          alt="login imag"
          className="image"
        />
      </div>

      <div className="login-card">
        <form onSubmit={handleSubmit} className="form-element">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="website logo"
            className="logo"
          />
          <br />
          <label className="label" htmlFor="username">
            USERNAME
          </label>
          <input
            value={username}
            onChange={handleUsername}
            placeholder="Username"
            className="input"
            type="text"
            id="username"
          />
          <label className="label" htmlFor="password">
            PASSWORD
          </label>
          <input
            value={password}
            onChange={handlePassword}
            placeholder="Password"
            className="input"
            type={showPassword ? 'text' : 'password'}
            id="password"
          />

          <div className="checkbox-container">
            <input
              onChange={handleCheckbox}
              type="checkbox"
              id="checkbox"
              className="checkbox"
            />
            <label className="show-password" htmlFor="checkbox">
              Show Password
            </label>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showError && <p className="error-msg">{errorMsg}</p>}
        </form>
      </div>
    </LoginContainer>
  )
}

export default Login
