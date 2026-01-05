import React, { useState, useEffect } from 'react'
import { useMusic } from '../../contexts/MusicContext'
import './MusicTab.css'
import * as youtubeApi from '../../services/youtubeApi'

// Mock Data - Following UI-first pattern
const mockPlaylists = [
  {
    id: 'PL1',
    title: 'Coding Focus',
    description: 'Deep focus music for programming',
    thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg',
    itemCount: 45,
    youtubePlaylistId: 'PLxxx'
  },
  {
    id: 'PL2',
    title: 'Workout Motivation',
    description: 'High energy workout music',
    thumbnailUrl: 'https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg',
    itemCount: 32,
    youtubePlaylistId: 'PLyyy'
  },
  {
    id: 'PL3',
    title: 'Jazz Evening',
    description: 'Smooth jazz for relaxation',
    thumbnailUrl: 'https://i.ytimg.com/vi/Dx5qFachd3A/mqdefault.jpg',
    itemCount: 28,
    youtubePlaylistId: 'PLzzz'
  },
  {
    id: 'PL4',
    title: 'Lo-fi Chill Vibes',
    description: 'Chill beats to relax',
    thumbnailUrl: 'https://i.ytimg.com/vi/5yx6BWlEVcY/mqdefault.jpg',
    itemCount: 56,
    youtubePlaylistId: 'PLaaa'
  }
]

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

const mockGenres = [
  {
    id: 'jazz',
    label: 'Jazz',
    icon: '🎷',
    subGenres: ['Smooth', 'Night'],
    searchQuery: 'smooth jazz music mix'
  },
  {
    id: 'lofi',
    label: 'Lo-fi',
    icon: '🎧',
    subGenres: ['Hip-Hop', 'Chill'],
    searchQuery: 'lofi hip hop mix'
  },
  {
    id: 'classical',
    label: 'Classical',
    icon: '🎻',
    subGenres: [],
    searchQuery: 'classical music mix'
  },
  {
    id: 'focus',
    label: 'Focus',
    icon: '🧠',
    subGenres: [],
    searchQuery: 'focus music deep work'
  },
  {
    id: 'synth',
    label: 'Synth',
    icon: '🎹',
    subGenres: [],
    searchQuery: 'synthwave music'
  }
]

function MusicTab() {
  // Get player state and controls from context
  const {
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
    playerRef,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleSeek,
    handleVolumeChange,
    toggleShuffle,
    toggleRepeat
  } = useMusic()

  // UI State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [expandedGenre, setExpandedGenre] = useState(null)
  const [playlists, setPlaylists] = useState(mockPlaylists) // Start with mock data
  const [loadingPlaylists, setLoadingPlaylists] = useState(false)
  const [isBrowseMode, setIsBrowseMode] = useState(false)
  const [selectedPlaylistForBrowse, setSelectedPlaylistForBrowse] = useState(null)
  const [playlistVideos, setPlaylistVideos] = useState([])
  const [loadingPlaylistVideos, setLoadingPlaylistVideos] = useState(false)
  const [hiddenPlaylists, setHiddenPlaylists] = useState(() => {
    // Load hidden playlists from localStorage
    const saved = localStorage.getItem('hiddenPlaylists')
    return saved ? JSON.parse(saved) : []
  })
  const [isHiddenSectionCollapsed, setIsHiddenSectionCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [moreLikeThisResults, setMoreLikeThisResults] = useState([])
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [showingRecommendations, setShowingRecommendations] = useState(true)
  const [carouselPage, setCarouselPage] = useState(0)

  // Check authentication status and fetch playlists
  useEffect(() => {
    const checkAuth = async () => {
      const status = await youtubeApi.checkAuthStatus()
      setIsAuthenticated(status.authenticated)

      if (status.authenticated) {
        // Fetch real playlists
        setLoadingPlaylists(true)
        const result = await youtubeApi.getUserPlaylists()
        if (result.success && result.playlists.length > 0) {
          setPlaylists(result.playlists)
        }
        setLoadingPlaylists(false)
      }
    }

    checkAuth()

    // Listen for OAuth success from popup
    const handleOAuthMessage = (event) => {
      if (event.data === 'oauth_success') {
        checkAuth()
      }
    }
    window.addEventListener('message', handleOAuthMessage)

    return () => {
      window.removeEventListener('message', handleOAuthMessage)
    }
  }, [])

  // YouTube IFrame API Initialization
  useEffect(() => {
    // Load YouTube IFrame API script if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

      // Set global callback for when API is ready
      window.onYouTubeIframeAPIReady = initializePlayer
    } else {
      initializePlayer()
    }

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])

  // Progress bar updates are now handled in MusicContext

  const initializePlayer = () => {
    const newPlayer = new window.YT.Player('youtube-player', {
      height: '1',
      width: '1',
      videoId: currentVideo.videoId,
      playerVars: {
        controls: 0,
        autoplay: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    })
    playerRef.current = newPlayer
    setPlayer(newPlayer)
  }

  const onPlayerReady = (event) => {
    setDuration(event.target.getDuration())
    event.target.setVolume(volume)
  }

  const onPlayerStateChange = (event) => {
    setPlayerState(event.data)

    // Update duration when video starts playing (fixes 0:00 duration issue)
    if (event.data === 1 && event.target.getDuration) {
      const videoDuration = event.target.getDuration()
      if (videoDuration > 0) {
        setDuration(videoDuration)
      }
    }

    if (event.data === 0) { // Video ended
      if (repeatMode === 'one') {
        // Repeat current video
        event.target.playVideo()
      } else if (repeatMode === 'all' || currentIndex < queue.length - 1 || isShuffleOn) {
        // Go to next video (will loop back if repeat all is on)
        handleNext()
      }
      // If repeat is off and we're at the end, just stop
    }
  }

  const onPlayerError = (event) => {
    console.error('YouTube Player Error:', event.data)
  }

  // Player control functions are now provided by MusicContext

  // Wrapper functions to handle event-based calls in JSX
  const handleSeekFromEvent = (e) => {
    const seekBar = e.currentTarget
    const rect = seekBar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration
    handleSeek(newTime)
  }

  const handleVolumeChangeFromEvent = (e) => {
    const newVolume = parseInt(e.target.value)
    handleVolumeChange(newVolume)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayVideo = (video) => {
    if (!playerRef.current) return

    // Find the video in the current queue to update the index
    const videoIndex = queue.findIndex(v => v.videoId === video.videoId)
    if (videoIndex !== -1) {
      setCurrentIndex(videoIndex)
    }

    playerRef.current.loadVideoById(video.videoId)
    setCurrentVideo({
      videoId: video.videoId,
      title: video.title,
      artist: video.artist || video.channelTitle,
      thumbnail: video.thumbnail
    })

    // Ensure recommendations widget shows
    setShowingRecommendations(true)
  }

  const togglePlaylistVisibility = (playlistId) => {
    setHiddenPlaylists(prev => {
      const newHidden = prev.includes(playlistId)
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]

      // Save to localStorage
      localStorage.setItem('hiddenPlaylists', JSON.stringify(newHidden))
      return newHidden
    })
  }

  const handleBrowsePlaylists = async () => {
    setIsBrowseMode(true)
    const visiblePlaylists = playlists.filter(p => !hiddenPlaylists.includes(p.id))
    if (visiblePlaylists.length > 0) {
      // Auto-select first visible playlist
      await handleSelectPlaylistForBrowse(visiblePlaylists[0])
    }
  }

  const handleBackToMain = () => {
    setIsBrowseMode(false)
    setSelectedPlaylistForBrowse(null)
    setPlaylistVideos([])
  }

  const handleSelectPlaylistForBrowse = async (playlist) => {
    setSelectedPlaylistForBrowse(playlist)
    setLoadingPlaylistVideos(true)

    try {
      const result = await youtubeApi.getPlaylistVideos(playlist.youtubePlaylistId)
      if (result.success) {
        setPlaylistVideos(result.videos)
      }
    } catch (error) {
      console.error('Error loading playlist videos:', error)
    }

    setLoadingPlaylistVideos(false)
  }

  const handlePlayFromBrowse = (video, index) => {
    if (!playerRef.current) return

    // Set the entire playlist as current queue
    setQueue(playlistVideos)
    setCurrentIndex(index)

    playerRef.current.loadVideoById(video.videoId)
    setCurrentVideo({
      videoId: video.videoId,
      title: video.title,
      artist: video.channelTitle,
      thumbnail: video.thumbnail
    })

    // Ensure recommendations widget shows
    setShowingRecommendations(true)
  }

  const handlePlayPlaylist = async (playlist) => {
    if (!playerRef.current) return

    try {
      const result = await youtubeApi.getPlaylistVideos(playlist.youtubePlaylistId)

      if (result.success && result.videos.length > 0) {
        setQueue(result.videos)
        setCurrentIndex(0)

        const firstVideo = result.videos[0]
        playerRef.current.loadVideoById(firstVideo.videoId)
        setCurrentVideo({
          videoId: firstVideo.videoId,
          title: firstVideo.title,
          artist: firstVideo.channelTitle,
          thumbnail: firstVideo.thumbnail
        })

        // Ensure recommendations widget shows
        setShowingRecommendations(true)
      }
    } catch (error) {
      console.error('Error loading playlist:', error)
      alert('Failed to load playlist. Please make sure you are authenticated.')
    }
  }

  const handleGenrePlay = async (genreId, subGenre = null) => {
    if (!playerRef.current) return

    try {
      const genre = mockGenres.find(g => g.id === genreId)
      const searchTerm = subGenre ? `${subGenre} ${genre.searchQuery}` : genre.searchQuery

      const result = await youtubeApi.searchYouTube(searchTerm, 1)

      if (result.success && result.videos.length > 0) {
        const video = result.videos[0]
        playerRef.current.loadVideoById(video.videoId)
        setCurrentVideo({
          videoId: video.videoId,
          title: video.title,
          artist: video.channelTitle,
          thumbnail: video.thumbnail
        })

        // Ensure recommendations widget shows
        setShowingRecommendations(true)
      }
    } catch (error) {
      console.error('Error searching YouTube:', error)
      alert('Failed to search YouTube. Please try again.')
    }
  }

  const fetchMoreLikeThis = async (videoId) => {
    if (!videoId || !currentVideo?.title) return

    setIsLoadingRecommendations(true)
    try {
      // Search for similar music based on current song title/artist
      const searchQuery = currentVideo.artist
        ? `${currentVideo.title} ${currentVideo.artist}`
        : currentVideo.title

      const result = await youtubeApi.searchYouTube(searchQuery, 12)
      if (result.success) {
        // Filter out the current video from recommendations
        const filteredVideos = result.videos.filter(v => v.videoId !== videoId)
        setMoreLikeThisResults(filteredVideos)
        setCarouselPage(0)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
    setIsLoadingRecommendations(false)
  }

  // Fetch "More Like This" when current video changes or when switching back to recommendations mode
  React.useEffect(() => {
    if (currentVideo?.videoId && showingRecommendations) {
      fetchMoreLikeThis(currentVideo.videoId)
    }
  }, [currentVideo?.videoId, showingRecommendations])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowingRecommendations(false)
    setCarouselPage(0)
    try {
      const result = await youtubeApi.searchYouTube(searchQuery, 12)
      if (result.success) {
        setSearchResults(result.videos)
      }
    } catch (error) {
      console.error('Error searching:', error)
    }
    setIsSearching(false)
  }

  const handleBackToRecommendations = () => {
    setShowingRecommendations(true)
    setSearchQuery('')
    setSearchResults([])
    setCarouselPage(0)
  }

  const handlePlaySearchResult = (video) => {
    if (!playerRef.current) return

    playerRef.current.loadVideoById(video.videoId)
    setCurrentVideo({
      videoId: video.videoId,
      title: video.title,
      artist: video.channelTitle,
      thumbnail: video.thumbnail
    })

    // Reset to recommendations mode to trigger "More Like This" fetch
    setShowingRecommendations(true)
    setSearchQuery('')
    setSearchResults([])
  }

  const itemsPerPage = 3
  const activeResults = showingRecommendations ? moreLikeThisResults : searchResults
  const totalPages = Math.ceil(activeResults.length / itemsPerPage)
  const displayedResults = activeResults.slice(
    carouselPage * itemsPerPage,
    (carouselPage + 1) * itemsPerPage
  )

  const handlePrevPage = () => {
    setCarouselPage(prev => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCarouselPage(prev => Math.min(totalPages - 1, prev + 1))
  }

  return (
    <div className="music-container">
      {/* Header */}
      <div className="music-header">
        <h1>🎵 Music</h1>
        <div className={`oauth-status ${isAuthenticated ? 'connected' : ''}`}>
          {isAuthenticated ? (
            <>
              <span>✓ Connected to YouTube</span>
              <button
                className="btn btn-secondary"
                onClick={async () => {
                  const result = await youtubeApi.revokeOAuth()
                  if (result.success) {
                    setIsAuthenticated(false)
                    setPlaylists(mockPlaylists)
                  }
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => youtubeApi.initiateOAuth()}
            >
              🔐 Connect YouTube OAuth
            </button>
          )}
        </div>
      </div>

      {/* YouTube Player Section */}
      <div className="youtube-player-section">
        <h2>Now Playing</h2>
        <div className="player-wrapper">
          {/* Hidden YouTube IFrame (audio-only) */}
          <div className="hidden-iframe-container">
            <div id="youtube-player"></div>
          </div>

          {/* Player Display */}
          <div className="player-display">
            <img
              src={currentVideo.thumbnail}
              alt={currentVideo.title}
              className="video-thumbnail"
            />
            <div className="video-info">
              <h3 className="video-title">{currentVideo.title}</h3>
              <p className="video-artist">{currentVideo.artist}</p>
            </div>
            {currentVideo.videoId && (
              <a
                href={`https://www.youtube.com/watch?v=${currentVideo.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-link-btn"
                title="Open in YouTube"
              >
                <span className="youtube-icon">▶</span> YouTube
              </a>
            )}
          </div>

          {/* Player Controls */}
          <div className="player-controls">
            <div className="seek-bar-container">
              <div className="seek-bar" onClick={handleSeekFromEvent}>
                <div
                  className="seek-progress"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="seek-thumb"></div>
                </div>
              </div>
              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="control-buttons">
              <button className="control-btn" onClick={handlePrevious} title="Previous">
                ⏴
              </button>
              <button
                className="control-btn play-pause"
                onClick={handlePlayPause}
                title={playerState === 1 ? 'Pause' : 'Play'}
              >
                {playerState === 1 ? '❚❚' : '▶'}
              </button>
              <button className="control-btn" onClick={handleNext} title="Next">
                ⏵
              </button>

              <button
                className={`control-btn ${isShuffleOn ? 'active' : ''}`}
                onClick={toggleShuffle}
                title={isShuffleOn ? 'Shuffle On' : 'Shuffle Off'}
              >
                {isShuffleOn ? '⇄' : '→'}
              </button>
              <button
                className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`}
                onClick={toggleRepeat}
                title={repeatMode === 'off' ? 'Repeat Off' : repeatMode === 'all' ? 'Repeat All' : 'Repeat One'}
              >
                {repeatMode === 'one' ? '⟳₁' : '⟳'}
              </button>

              <div className="volume-control">
                <span>♪</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChangeFromEvent}
                  className="volume-slider"
                />
                <span>{volume}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search / More Like This Widget */}
      <div className="search-widget">
        <div className="search-widget-header">
          <h2>{showingRecommendations ? 'More Like This' : 'Find a Song'}</h2>
          {!showingRecommendations && (
            <button className="btn btn-secondary btn-small" onClick={handleBackToRecommendations}>
              ← More Like This
            </button>
          )}
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder={showingRecommendations ? "Or search for a song, artist, or album..." : "Search for a song, artist, or album..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={isSearching}>
            {isSearching ? '🔄' : '🔍'}
          </button>
        </form>

        {(isLoadingRecommendations || isSearching) && (
          <div className="loading-message">Loading...</div>
        )}

        {!isLoadingRecommendations && !isSearching && displayedResults.length > 0 && (
          <div className="carousel-container">
            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={handlePrevPage}
              disabled={carouselPage === 0}
            >
              ◀
            </button>

            <div className="carousel-results">
              {displayedResults.map(video => (
                <div
                  key={video.videoId}
                  className="carousel-result-item"
                  onClick={() => handlePlaySearchResult(video)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="carousel-result-thumbnail"
                  />
                  <div className="carousel-result-info">
                    <div className="carousel-result-title">
                      <div className="scrolling-text">{video.title}</div>
                    </div>
                    <div className="carousel-result-artist">{video.channelTitle}</div>
                  </div>
                  <button className="carousel-result-play-btn">▶</button>
                </div>
              ))}
            </div>

            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={handleNextPage}
              disabled={carouselPage === totalPages - 1}
            >
              ▶
            </button>
          </div>
        )}

        {!isLoadingRecommendations && !isSearching && activeResults.length > 0 && (
          <div className="carousel-indicator">
            Page {carouselPage + 1} of {totalPages}
          </div>
        )}
      </div>

      {/* Genre Quick Play Section */}
      <div className="genre-quick-play">
        <h2>Genre Quick Play</h2>
        <div className="genre-cards-grid">
          {mockGenres.map(genre => (
            <div
              key={genre.id}
              className={`genre-card ${expandedGenre === genre.id ? 'expanded' : ''}`}
              onClick={() => setExpandedGenre(expandedGenre === genre.id ? null : genre.id)}
            >
              <div className="genre-card-header">
                <span className="genre-icon">{genre.icon}</span>
                <span className="genre-label">{genre.label}</span>
                <span className="expand-arrow">{expandedGenre === genre.id ? '▲' : '▼'}</span>
              </div>

              {expandedGenre === genre.id && genre.subGenres.length > 0 && (
                <div className="subgenres-list">
                  {genre.subGenres.map(sub => (
                    <button
                      key={sub}
                      className="subgenre-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenrePlay(genre.id, sub)
                      }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Your Playlists Section - Only show if not in browse mode */}
      {!isBrowseMode && (
        <>
          <div className="playlists-section">
            <div className="playlists-header">
              <h2>Your Playlists</h2>
              <button className="btn btn-secondary" onClick={handleBrowsePlaylists}>
                Browse Playlists
              </button>
            </div>
            <div className="playlists-grid">
              {playlists
                .filter(playlist => !hiddenPlaylists.includes(playlist.id))
                .map(playlist => (
                  <div
                    key={playlist.id}
                    className="playlist-card"
                  >
                    <button
                      className="playlist-hide-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePlaylistVisibility(playlist.id)
                      }}
                      title="Hide this playlist"
                    >
                      👁️
                    </button>
                    <div onClick={() => handlePlayPlaylist(playlist)}>
                      <img
                        src={playlist.thumbnailUrl}
                        alt={playlist.title}
                        className="playlist-thumbnail"
                      />
                      <div className="playlist-info">
                        <h3 className="playlist-title">{playlist.title}</h3>
                        <p className="playlist-count">{playlist.itemCount} songs</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Hidden Playlists Section */}
          {hiddenPlaylists.length > 0 && (
            <div className="hidden-playlists-section">
              <div className="playlists-header">
                <h2>Hidden Playlists ({hiddenPlaylists.length})</h2>
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => setIsHiddenSectionCollapsed(!isHiddenSectionCollapsed)}
                  title={isHiddenSectionCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isHiddenSectionCollapsed ? '▼ Expand' : '▲ Collapse'}
                </button>
              </div>
              {!isHiddenSectionCollapsed && (
                <div className="playlists-grid">
                  {playlists
                    .filter(playlist => hiddenPlaylists.includes(playlist.id))
                    .map(playlist => (
                      <div
                        key={playlist.id}
                        className="playlist-card hidden-playlist-card"
                      >
                        <button
                          className="playlist-unhide-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePlaylistVisibility(playlist.id)
                          }}
                          title="Show this playlist"
                        >
                          👁️‍🗨️
                        </button>
                        <div onClick={() => handlePlayPlaylist(playlist)}>
                          <img
                            src={playlist.thumbnailUrl}
                            alt={playlist.title}
                            className="playlist-thumbnail"
                          />
                          <div className="playlist-info">
                            <h3 className="playlist-title">{playlist.title}</h3>
                            <p className="playlist-count">{playlist.itemCount} songs</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Browse Playlists View */}
      {isBrowseMode && (
        <div className="browse-playlists-section">
          <div className="browse-header">
            <button className="btn btn-secondary" onClick={handleBackToMain}>
              ← Back to Overview
            </button>
            <h2>Browse Playlists</h2>
          </div>

          <div className="browse-content">
            {/* Playlist selector sidebar */}
            <div className="playlist-selector">
              <h3>Your Playlists</h3>
              <div className="playlist-list">
                {playlists
                  .filter(playlist => !hiddenPlaylists.includes(playlist.id))
                  .map(playlist => (
                    <div
                      key={playlist.id}
                      className={`playlist-list-item ${selectedPlaylistForBrowse?.id === playlist.id ? 'selected' : ''}`}
                      onClick={() => handleSelectPlaylistForBrowse(playlist)}
                    >
                      <img
                        src={playlist.thumbnailUrl}
                        alt={playlist.title}
                        className="playlist-list-thumbnail"
                      />
                      <div className="playlist-list-info">
                        <div className="playlist-list-title">{playlist.title}</div>
                        <div className="playlist-list-count">{playlist.itemCount} songs</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Videos list */}
            <div className="videos-list">
              {selectedPlaylistForBrowse && (
                <>
                  <div className="videos-list-header">
                    <h3>{selectedPlaylistForBrowse.title}</h3>
                    <p>{playlistVideos.length} songs</p>
                  </div>

                  {loadingPlaylistVideos ? (
                    <div className="loading-message">Loading songs...</div>
                  ) : (
                    <div className="video-items">
                      {playlistVideos.map((video, index) => (
                        <div
                          key={video.videoId}
                          className="video-item"
                          onClick={() => handlePlayFromBrowse(video, index)}
                        >
                          <div className="video-item-number">{index + 1}</div>
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="video-item-thumbnail"
                          />
                          <div className="video-item-info">
                            <div className="video-item-title">
                              <div className="scrolling-text">{video.title}</div>
                            </div>
                            <div className="video-item-channel">{video.channelTitle}</div>
                          </div>
                          <button className="video-item-play-btn">▶</button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recently Played Section */}
      <div className="recently-played-section">
        <h2>Recently Played</h2>
        <div className="recently-played-list">
          {mockRecentlyPlayed.map(song => (
            <div
              key={song.videoId}
              className="recently-played-item"
              onClick={() => handlePlayVideo(song)}
            >
              <img
                src={song.thumbnail}
                alt={song.title}
                className="recent-thumbnail"
              />
              <div className="recent-info">
                <h4 className="recent-title">{song.title}</h4>
                <p className="recent-artist">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MusicTab
