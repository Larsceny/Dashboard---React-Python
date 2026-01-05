/**
 * YouTube API Service
 * Handles all YouTube API calls to the backend
 */

const API_BASE_URL = 'http://localhost:5000/api/youtube'

/**
 * Check OAuth authentication status
 */
export const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/oauth/status`, {
      credentials: 'include'
    })
    return await response.json()
  } catch (error) {
    console.error('Error checking auth status:', error)
    return { authenticated: false }
  }
}

/**
 * Initiate OAuth flow
 */
export const initiateOAuth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/oauth/authorize`, {
      credentials: 'include'
    })
    const data = await response.json()

    if (data.authorization_url) {
      // Open OAuth flow in new window
      window.open(data.authorization_url, '_blank', 'width=600,height=700')
      return { success: true }
    }
    return { success: false, error: 'No authorization URL returned' }
  } catch (error) {
    console.error('Error initiating OAuth:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Revoke OAuth credentials
 */
export const revokeOAuth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/oauth/revoke`, {
      method: 'POST',
      credentials: 'include'
    })
    return await response.json()
  } catch (error) {
    console.error('Error revoking OAuth:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get user's YouTube playlists
 */
export const getUserPlaylists = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/playlists`, {
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch playlists')
    }

    const data = await response.json()
    return { success: true, playlists: data.playlists }
  } catch (error) {
    console.error('Error fetching playlists:', error)
    return { success: false, error: error.message, playlists: [] }
  }
}

/**
 * Get videos from a specific playlist
 */
export const getPlaylistVideos = async (playlistId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/playlist/${playlistId}/items`, {
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch playlist videos')
    }

    const data = await response.json()
    return { success: true, videos: data.videos }
  } catch (error) {
    console.error('Error fetching playlist videos:', error)
    return { success: false, error: error.message, videos: [] }
  }
}

/**
 * Search YouTube for videos (for genre quick play)
 */
export const searchYouTube = async (query, maxResults = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
      { credentials: 'include' }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to search YouTube')
    }

    const data = await response.json()
    return { success: true, videos: data.videos }
  } catch (error) {
    console.error('Error searching YouTube:', error)
    return { success: false, error: error.message, videos: [] }
  }
}

/**
 * Get video details
 */
export const getVideoDetails = async (videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/video/${videoId}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch video details')
    }

    return { success: true, video: await response.json() }
  } catch (error) {
    console.error('Error fetching video details:', error)
    return { success: false, error: error.message }
  }
}
