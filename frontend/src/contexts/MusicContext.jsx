import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

const MusicContext = createContext()

export const useMusic = () => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}

const mockRecentlyPlayed = [
  {
    videoId: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Mix - Beats to Relax/Study to',
    artist: 'Lofi Girl',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg',
    timestamp: '2024-01-01T14:23:00Z',
    duration: 3645
  },
  {
    videoId: '5qap5aO4i9A',
    title: 'Chill Lofi Study Music',
    artist: 'ChilledCow',
    thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg',
    timestamp: '2024-01-01T12:15:00Z',
    duration: 2134
  },
  {
    videoId: 'Dx5qFachd3A',
    title: 'Smooth Jazz Night',
    artist: 'Jazz Cafe',
    thumbnail: 'https://i.ytimg.com/vi/Dx5qFachd3A/mqdefault.jpg',
    timestamp: '2024-01-01T10:45:00Z',
    duration: 4200
  },
  {
    videoId: '5yx6BWlEVcY',
    title: 'Focus Flow - Deep Work Music',
    artist: 'Study Music',
    thumbnail: 'https://i.ytimg.com/vi/5yx6BWlEVcY/mqdefault.jpg',
    timestamp: '2024-01-01T09:30:00Z',
    duration: 3800
  }
]

export const MusicProvider = ({ children }) => {
  // YouTube Player State
  const [player, setPlayer] = useState(null)
  const [playerState, setPlayerState] = useState(-1) // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
  const [currentVideo, setCurrentVideo] = useState({
    videoId: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Mix - Beats to Relax/Study to',
    artist: 'Lofi Girl',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg'
  })
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [queue, setQueue] = useState(mockRecentlyPlayed)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isShuffleOn, setIsShuffleOn] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off') // 'off', 'all', 'one'

  const playerRef = useRef(null)
  const progressIntervalRef = useRef(null)

  // Player control functions
  const playVideo = (videoId, videoTitle = '', artist = '', thumbnail = '') => {
    if (playerRef.current && videoId) {
      playerRef.current.loadVideoById(videoId)
      setCurrentVideo({
        videoId,
        title: videoTitle || 'Loading...',
        artist: artist || '',
        thumbnail: thumbnail || ''
      })
    }
  }

  const handlePlayPause = () => {
    if (!playerRef.current) return

    if (playerState === 1) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const handleNext = () => {
    if (queue.length === 0) return

    let nextIndex
    if (repeatMode === 'one') {
      // Replay current song
      if (playerRef.current) {
        playerRef.current.seekTo(0)
        playerRef.current.playVideo()
      }
      return
    } else if (isShuffleOn) {
      // Random next song
      nextIndex = Math.floor(Math.random() * queue.length)
    } else {
      // Sequential next
      nextIndex = currentIndex + 1
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0 // Loop back to start
        } else {
          return // Stop at end
        }
      }
    }

    setCurrentIndex(nextIndex)
    const nextVideo = queue[nextIndex]
    playVideo(
      nextVideo.videoId,
      nextVideo.title,
      nextVideo.artist || nextVideo.channelTitle || '',
      nextVideo.thumbnail
    )
  }

  const handlePrevious = () => {
    if (queue.length === 0) return

    // If more than 3 seconds into song, restart current song
    if (currentTime > 3) {
      playerRef.current.seekTo(0)
      return
    }

    let prevIndex
    if (isShuffleOn) {
      // Random previous song
      prevIndex = Math.floor(Math.random() * queue.length)
    } else {
      // Sequential previous
      prevIndex = currentIndex - 1
      if (prevIndex < 0) {
        if (repeatMode === 'all') {
          prevIndex = queue.length - 1 // Loop to end
        } else {
          prevIndex = 0 // Stay at start
        }
      }
    }

    setCurrentIndex(prevIndex)
    const prevVideo = queue[prevIndex]
    playVideo(
      prevVideo.videoId,
      prevVideo.title,
      prevVideo.artist || prevVideo.channelTitle || '',
      prevVideo.thumbnail
    )
  }

  const handleSeek = (newTime) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newTime)
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (newVolume) => {
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
      setVolume(newVolume)
    }
  }

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn)
  }

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one']
    const currentModeIndex = modes.indexOf(repeatMode)
    const nextMode = modes[(currentModeIndex + 1) % modes.length]
    setRepeatMode(nextMode)
  }

  // Progress tracking
  useEffect(() => {
    if (playerState === 1) {
      // Playing - update progress every second
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          setCurrentTime(playerRef.current.getCurrentTime())
        }
      }, 1000)
    } else {
      // Paused or stopped - clear interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [playerState])

  const contextValue = {
    // State
    player,
    setPlayer,
    playerState,
    setPlayerState,
    currentVideo,
    setCurrentVideo,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    queue,
    setQueue,
    currentIndex,
    setCurrentIndex,
    isShuffleOn,
    setIsShuffleOn,
    repeatMode,
    setRepeatMode,

    // Refs
    playerRef,
    progressIntervalRef,

    // Functions
    playVideo,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleSeek,
    handleVolumeChange,
    toggleShuffle,
    toggleRepeat
  }

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  )
}
