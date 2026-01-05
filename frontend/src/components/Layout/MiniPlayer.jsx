import React from 'react'
import { useMusic } from '../../contexts/MusicContext'
import './MiniPlayer.css'

function MiniPlayer() {
  const {
    playerState,
    currentVideo,
    repeatMode,
    volume,
    handlePlayPause,
    handleNext,
    handlePrevious,
    toggleRepeat,
    handleVolumeChange
  } = useMusic()

  // Don't show mini player if no song is loaded
  if (!currentVideo.videoId) {
    return null
  }

  const isPlaying = playerState === 1

  return (
    <div className="mini-player">
      <div className="mini-player-info">
        {currentVideo.thumbnail && (
          <img src={currentVideo.thumbnail} alt={currentVideo.title} className="mini-player-thumbnail" />
        )}
        <div className="mini-player-text">
          <div className="mini-player-title">{currentVideo.title}</div>
          {currentVideo.artist && <div className="mini-player-artist">{currentVideo.artist}</div>}
        </div>
      </div>

      <div className="mini-player-controls">
        <button className="mini-control-btn" onClick={handlePrevious} title="Previous">
          ◄◄
        </button>
        <button className="mini-control-btn mini-play-pause" onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '❚❚' : '▶'}
        </button>
        <button className="mini-control-btn" onClick={handleNext} title="Next">
          ►►
        </button>
        <button
          className={`mini-control-btn ${repeatMode !== 'off' ? 'active' : ''}`}
          onClick={toggleRepeat}
          title={repeatMode === 'off' ? 'Repeat Off' : repeatMode === 'all' ? 'Repeat All' : 'Repeat One'}
        >
          {repeatMode === 'one' ? '1↻' : '↻'}
        </button>
      </div>

      <div className="mini-volume-control">
        <span className="volume-icon">♪</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
          className="mini-volume-slider"
        />
        <span className="volume-label">{volume}%</span>
      </div>
    </div>
  )
}

export default MiniPlayer
