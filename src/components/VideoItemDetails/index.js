import {useState, useEffect, useCallback, useContext, useMemo} from 'react'
import Cookies from 'js-cookie'
import {formatDistanceToNow} from 'date-fns'
import {FaDotCircle} from 'react-icons/fa'
import ReactPlayer from 'react-player'
import {BiLike} from 'react-icons/bi'
import {RiVideoUploadLine} from 'react-icons/ri'
import {AiOutlineDislike} from 'react-icons/ai'
import Loader from 'react-loader-spinner'
import FailureView from '../FailureView'
import NxtContext from '../../context/NxtContext'
import Header from '../Header'
import Sidebar from '../Sidebar'
import {
  HomeBgContainer,
  HomeContainer,
  DataContainer,
  StyledHeading,
  StyledHr,
  ChannelName,
  Content,
} from '../../Style'
import './index.css'

const VideoItemDetails = props => {
  const {match} = props
  const {params} = match
  const {id} = params
  const [videoData, setVideoData] = useState(null)
  const [isFailure, setIsFailure] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const {
    savedVideos,
    updateSavedVideos,
    likedVideos,
    updateLikedVideos,
    dislikedVideos,
    updateDislikedVideos,
    darkTheme,
  } = useContext(NxtContext)

  const handleSaveVideo = useCallback(() => {
    const isVideoAlreadySaved = savedVideos.some(
      video => video.id === videoData.id,
    )
    if (!isVideoAlreadySaved) {
      updateSavedVideos(videoData) // Add video to saved list
      setIsSaved(true)
      setSuccessMessage('Video saved successfully!')
    } else {
      updateSavedVideos(videoData, true) // Remove video from saved list
      setIsSaved(false)
      setSuccessMessage('Video removed from saved.')
    }
  }, [videoData, savedVideos, updateSavedVideos])

  const handleLikeVideo = useCallback(() => {
    if (!isLiked) {
      setIsLiked(true)
      setIsDisliked(false)
      updateLikedVideos(videoData)
      setSuccessMessage('Video liked successfully!')
    } else {
      setIsLiked(false) // Remove like
      setSuccessMessage('Like removed.')
    }
  }, [isLiked, videoData, updateLikedVideos])

  const handleDislikeVideo = useCallback(() => {
    if (!isDisliked) {
      setIsDisliked(true)
      setIsLiked(false)
      updateDislikedVideos(videoData)
      setSuccessMessage('Video disliked successfully!')
    } else {
      setIsDisliked(false) // Remove dislike
      setSuccessMessage('Dislike removed.')
    }
  }, [isDisliked, videoData, updateDislikedVideos])

  const fetchVideoData = useCallback(async () => {
    setIsLoading(true)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const responseData = await response.json()

      if (response.ok) {
        const updatedData = {
          id: responseData.video_details.id,
          channel: responseData.video_details.channel,
          videoUrl: responseData.video_details.video_url,
          thumbnailUrl: responseData.video_details.thumbnail_url,
          description: responseData.video_details.description,
          title: responseData.video_details.title,
          publishedAt: responseData.video_details.published_at,
          viewCount: responseData.video_details.view_count,
        }
        setVideoData(updatedData)
        setIsLoading(false)

        // Check if the video is already liked, disliked, or saved
        setIsLiked(likedVideos.some(video => video.id === updatedData.id))
        setIsDisliked(dislikedVideos.some(video => video.id === updatedData.id))
        setIsSaved(savedVideos.some(video => video.id === updatedData.id))
      } else {
        setIsFailure(true)
        setIsLoading(false)
      }
    } catch (error) {
      setIsFailure(true)
      setIsLoading(false)
    }
  }, [id, savedVideos, likedVideos, dislikedVideos])

  useEffect(() => {
    fetchVideoData()
  }, [fetchVideoData])

  const renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="BallTriangle" color="green" height="80" width="80" />
    </div>
  )

  const publishedDate = useMemo(
    () => (videoData ? new Date(videoData.publishedAt) : null),
    [videoData],
  )

  const distance = useMemo(
    () =>
      publishedDate
        ? formatDistanceToNow(publishedDate, {addSuffix: true})
        : '',
    [publishedDate],
  )

  const renderSuccessView = useMemo(() => {
    if (!videoData) return null
    return (
      <DataContainer darkTheme={darkTheme}>
        <ReactPlayer
          url={videoData.videoUrl}
          width="100%"
          height="500px"
          controls
        />
        <StyledHeading darkTheme={darkTheme}>{videoData.title}</StyledHeading>
        <div className="views-and-likes-container">
          <div className="view-container">
            <p>{videoData.viewCount} views</p>
            <FaDotCircle />
            <p>{distance.replace(/about |almost |over |some /g, '')}</p>
          </div>
          <div className="view-container">
            <div className={`view-container ${isLiked ? 'active-button' : ''}`}>
              <BiLike size={20} onClick={handleLikeVideo} />
              <p onClick={handleLikeVideo}>Like</p>
            </div>
            <div
              className={`view-container ${isDisliked ? 'active-button' : ''}`}
            >
              <AiOutlineDislike onClick={handleDislikeVideo} size={20} />
              <p onClick={handleDislikeVideo}>Dislike</p>
            </div>
            <div className={`view-container ${isLiked ? 'active-button' : ''}`}>
              <RiVideoUploadLine onClick={handleSaveVideo} size={20} />
              <p onClick={handleSaveVideo}>{isSaved ? 'Saved' : 'Save'}</p>
            </div>
          </div>
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <StyledHr />
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <img
            src={videoData.channel.profile_image_url}
            alt="profile"
            className="profile-logo"
          />
          <div>
            <ChannelName darkTheme={darkTheme}>
              {videoData.channel.name}
            </ChannelName>
            <ChannelName darkTheme={darkTheme}>
              {videoData.channel.subscriber_count} subscribers
            </ChannelName>
          </div>
        </div>
        <Content darkTheme={darkTheme}>{videoData.description}</Content>
      </DataContainer>
    )
  }, [
    videoData,
    distance,
    successMessage,
    isLiked,
    isDisliked,
    isSaved,
    darkTheme,
    handleDislikeVideo,
    handleLikeVideo,
    handleSaveVideo,
  ])

  const renderFailureView = () => <FailureView />

  const renderVideoItemDetails = () => {
    if (isLoading) return renderLoaderView()
    if (isFailure) return renderFailureView()
    return renderSuccessView
  }

  return (
    <HomeBgContainer>
      <Header />
      <Sidebar />
      <HomeContainer>{renderVideoItemDetails()}</HomeContainer>
    </HomeBgContainer>
  )
}

export default VideoItemDetails
