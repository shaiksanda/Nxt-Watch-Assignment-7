import {useContext} from 'react'
import NxtContext from '../../context/NxtContext'
import {FailureBgContainer, Content} from '../../Style'

const FailureView = props => {
  const {fetchVideoData} = props
  const {darkTheme} = useContext(NxtContext)
  return (
    <FailureBgContainer darkTheme={darkTheme}>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt="failure view"
        className="image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <Content darkTheme={darkTheme}>
        We are having some trouble to complete your request please try again.
      </Content>
      <button onClick={fetchVideoData} type="button" className="retry-button">
        Retry
      </button>
    </FailureBgContainer>
  )
}

export default FailureView
