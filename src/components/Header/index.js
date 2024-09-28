import {useContext, useState} from 'react'
import {useHistory, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {RiLightbulbLine} from 'react-icons/ri'
import {FaHamburger} from 'react-icons/fa'
import {BiLogOut} from 'react-icons/bi'
import {HiLightBulb} from 'react-icons/hi'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css' // Import CSS for default styles
import NxtContext from '../../context/NxtContext'
import Sidebar from '../Sidebar'
import {HeaderContainer, LogoutContainer} from '../../Style' // Adjust the path accordingly
import './index.css'

const Header = () => {
  const history = useHistory()
  const {darkTheme, updateDarkTheme} = useContext(NxtContext)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(prev => !prev)
  }

  const handleLogout = close => {
    Cookies.remove('jwt_token')
    history.replace('/login') // Navigate to the login route
    close() // Close the popup
  }

  return (
    <HeaderContainer bgColor={darkTheme ? '#000000' : 'white'}>
      <div>
        <Link to="/" className="nav-item-link">
          {darkTheme ? (
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png"
              alt="website logo"
              className="logo"
            />
          ) : (
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
              alt="website logo"
              className="logo"
            />
          )}
        </Link>
      </div>
      <div className="medium-container">
        {darkTheme ? (
          <RiLightbulbLine
            onClick={updateDarkTheme}
            size={50}
            style={{cursor: 'pointer'}}
            color="white"
          />
        ) : (
          <HiLightBulb
            onClick={updateDarkTheme}
            size={50}
            style={{cursor: 'pointer'}}
          />
        )}
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
          alt="profile"
          className="profile"
        />

        <FaHamburger
          onClick={handleOpen}
          size={30}
          className="small-device-icon"
          color={darkTheme ? 'white' : 'black'}
        />
        <Sidebar isOpen={isOpen} />

        <Popup
          trigger={
            <div>
              <button type="button" className="logout-button">
                Logout
              </button>
              <BiLogOut
                color={darkTheme ? 'white' : 'black'}
                size={40}
                className="small-device-icon"
              />
            </div>
          }
          modal
          contentStyle={{backgroundColor: 'transparent', border: 'none'}}
        >
          {close => (
            <LogoutContainer darkTheme={darkTheme}>
              <h1 className="popup-heading">
                Are you sure you want to logout?
              </h1>
              <div className="popup-buttons">
                <button
                  type="button"
                  className="close-button"
                  onClick={close} // Close the popup
                >
                  Close
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  onClick={() => handleLogout(close)}
                >
                  Confirm
                </button>
              </div>
            </LogoutContainer>
          )}
        </Popup>
      </div>
    </HeaderContainer>
  )
}

export default Header
