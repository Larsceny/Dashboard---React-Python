"""
YouTube API Routes
Handles YouTube Data API v3 integration and OAuth flow
"""

from flask import Blueprint, jsonify, request, session, redirect, url_for
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os
import json

# Allow HTTP for local development (REMOVE IN PRODUCTION!)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

youtube_bp = Blueprint('youtube', __name__, url_prefix='/api/youtube')

# OAuth 2.0 configuration
SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']
CLIENT_CONFIG = {
    "web": {
        "client_id": os.getenv('YOUTUBE_CLIENT_ID'),
        "client_secret": os.getenv('YOUTUBE_CLIENT_SECRET'),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": ["http://localhost:5000/api/youtube/oauth/callback"]
    }
}

@youtube_bp.route('/oauth/authorize', methods=['GET'])
def oauth_authorize():
    """Initiate OAuth flow"""
    try:
        flow = Flow.from_client_config(
            CLIENT_CONFIG,
            scopes=SCOPES,
            redirect_uri='http://localhost:5000/api/youtube/oauth/callback'
        )

        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )

        session['state'] = state
        return jsonify({
            'authorization_url': authorization_url,
            'state': state
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@youtube_bp.route('/oauth/callback')
def oauth_callback():
    """Handle OAuth callback"""
    try:
        state = session.get('state')

        flow = Flow.from_client_config(
            CLIENT_CONFIG,
            scopes=SCOPES,
            state=state,
            redirect_uri='http://localhost:5000/api/youtube/oauth/callback'
        )

        flow.fetch_token(authorization_response=request.url)

        credentials = flow.credentials
        session['credentials'] = credentials_to_dict(credentials)
        session.permanent = True  # Ensure session persists

        # Return HTML that sends message to opener window and closes
        return '''
        <html>
            <head><title>Authentication Successful</title></head>
            <body>
                <h2>Authentication successful!</h2>
                <p>You can close this window now.</p>
                <script>
                    // Send success message to opener window
                    if (window.opener) {
                        window.opener.postMessage('oauth_success', '*');
                        // Close popup after short delay
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    }
                </script>
            </body>
        </html>
        '''
    except Exception as e:
        return f'''
        <html>
            <head><title>Authentication Failed</title></head>
            <body>
                <h2>Authentication failed</h2>
                <p>Error: {str(e)}</p>
                <p>You can close this window now.</p>
                <script>
                    if (window.opener) {{
                        window.opener.postMessage('oauth_error', '*');
                    }}
                </script>
            </body>
        </html>
        ''', 500


@youtube_bp.route('/oauth/status', methods=['GET'])
def oauth_status():
    """Check if user is authenticated"""
    credentials = session.get('credentials')
    return jsonify({
        'authenticated': credentials is not None,
        'has_refresh_token': credentials.get('refresh_token') is not None if credentials else False
    })


@youtube_bp.route('/oauth/revoke', methods=['POST'])
def oauth_revoke():
    """Revoke OAuth credentials"""
    session.pop('credentials', None)
    return jsonify({'success': True, 'message': 'Credentials revoked'})


@youtube_bp.route('/playlists', methods=['GET'])
def get_playlists():
    """Get user's YouTube playlists"""
    try:
        credentials = session.get('credentials')

        if not credentials:
            return jsonify({'error': 'Not authenticated'}), 401

        creds = Credentials(**credentials)
        youtube = build('youtube', 'v3', credentials=creds)

        # Fetch user's playlists
        request_playlists = youtube.playlists().list(
            part='snippet,contentDetails',
            mine=True,
            maxResults=50
        )
        response = request_playlists.execute()

        playlists = []
        for item in response.get('items', []):
            playlists.append({
                'id': item['id'],
                'title': item['snippet']['title'],
                'description': item['snippet'].get('description', ''),
                'thumbnailUrl': item['snippet']['thumbnails'].get('medium', {}).get('url', ''),
                'itemCount': item['contentDetails']['itemCount'],
                'youtubePlaylistId': item['id']
            })

        return jsonify({'playlists': playlists})
    except HttpError as e:
        return jsonify({'error': f'YouTube API error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@youtube_bp.route('/playlist/<playlist_id>/items', methods=['GET'])
def get_playlist_items(playlist_id):
    """Get videos from a specific playlist"""
    try:
        credentials = session.get('credentials')

        if not credentials:
            return jsonify({'error': 'Not authenticated'}), 401

        creds = Credentials(**credentials)
        youtube = build('youtube', 'v3', credentials=creds)

        # Fetch playlist items
        request_items = youtube.playlistItems().list(
            part='snippet,contentDetails',
            playlistId=playlist_id,
            maxResults=50
        )
        response = request_items.execute()

        videos = []
        for item in response.get('items', []):
            videos.append({
                'videoId': item['contentDetails']['videoId'],
                'title': item['snippet']['title'],
                'description': item['snippet'].get('description', ''),
                'thumbnail': item['snippet']['thumbnails'].get('medium', {}).get('url', ''),
                'channelTitle': item['snippet'].get('channelTitle', 'Unknown'),
                'position': item['snippet']['position']
            })

        return jsonify({'videos': videos})
    except HttpError as e:
        return jsonify({'error': f'YouTube API error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@youtube_bp.route('/search', methods=['GET'])
def search_youtube():
    """Search YouTube for videos (for genre quick play)"""
    try:
        query = request.args.get('q', '')
        max_results = request.args.get('maxResults', 10, type=int)

        if not query:
            return jsonify({'error': 'Query parameter required'}), 400

        # Use API key for public search (doesn't require OAuth)
        api_key = os.getenv('YOUTUBE_API_KEY')
        youtube = build('youtube', 'v3', developerKey=api_key)

        # Search for videos
        request_search = youtube.search().list(
            part='snippet',
            q=query,
            type='video',
            maxResults=max_results,
            videoCategoryId='10',  # Music category
            order='relevance'
        )
        response = request_search.execute()

        videos = []
        for item in response.get('items', []):
            videos.append({
                'videoId': item['id']['videoId'],
                'title': item['snippet']['title'],
                'description': item['snippet'].get('description', ''),
                'thumbnail': item['snippet']['thumbnails'].get('medium', {}).get('url', ''),
                'channelTitle': item['snippet'].get('channelTitle', 'Unknown')
            })

        return jsonify({'videos': videos})
    except HttpError as e:
        return jsonify({'error': f'YouTube API error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@youtube_bp.route('/video/<video_id>', methods=['GET'])
def get_video_details(video_id):
    """Get details for a specific video"""
    try:
        # Use API key for public data (doesn't require OAuth)
        api_key = os.getenv('YOUTUBE_API_KEY')
        youtube = build('youtube', 'v3', developerKey=api_key)

        request_video = youtube.videos().list(
            part='snippet,contentDetails,statistics',
            id=video_id
        )
        response = request_video.execute()

        if not response.get('items'):
            return jsonify({'error': 'Video not found'}), 404

        item = response['items'][0]
        video = {
            'videoId': item['id'],
            'title': item['snippet']['title'],
            'description': item['snippet'].get('description', ''),
            'thumbnail': item['snippet']['thumbnails'].get('medium', {}).get('url', ''),
            'channelTitle': item['snippet'].get('channelTitle', 'Unknown'),
            'duration': item['contentDetails'].get('duration', ''),
            'viewCount': item['statistics'].get('viewCount', 0)
        }

        return jsonify(video)
    except HttpError as e:
        return jsonify({'error': f'YouTube API error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def credentials_to_dict(credentials):
    """Convert credentials object to dictionary for session storage"""
    return {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
