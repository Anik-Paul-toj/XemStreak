export interface YouTubeAudioPreset {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
}

/**
 * Curated public, evergreen YouTube study playlists.
 * All presets are verified YouTube playlists for seamless non-stop background music.
 */
export const YOUTUBE_AUDIO_PRESETS: YouTubeAudioPreset[] = [
  {
    id: 'lofi',
    title: 'Lofi Study Beats',
    description: 'Chill lofi hip-hop radio beats to relax and study to',
    icon: '🎧',
    url: 'https://www.youtube.com/playlist?list=PLt7bG0K25iXi07OYe7jBTXvvdGItGM25I',
  },
  {
    id: 'piano-rain',
    title: 'Rain & Soft Piano',
    description: 'Gentle raindrops & calming acoustic piano melodies',
    icon: '🌧️',
    url: 'https://www.youtube.com/playlist?list=PLe533PvpOWli4DLNuphP-Cg0IXEuJ193l',
  },
  {
    id: 'forest',
    title: 'Deep Nature Forest',
    description: 'Birds chirping, gentle breezes & woodland soundscapes',
    icon: '🌲',
    url: 'https://www.youtube.com/playlist?list=PLQ_PIlf6OzqKzrKzQ8Ccz-IE2DhSyzrN2',
  },
  {
    id: 'classical',
    title: 'Classical Focus',
    description: 'Mozart, Chopin & Bach cognitive deep work playlist',
    icon: '🎻',
    url: 'https://www.youtube.com/playlist?list=PLRGWRtQ6ULUnnDvABOc3JywFd2NIVevJq',
  },
  {
    id: 'synthwave',
    title: 'Chill Synthwave',
    description: 'Atmospheric electronic & retrowave focus beats',
    icon: '🚀',
    url: 'https://www.youtube.com/playlist?list=PLOtNYlNIGer0jmWpFtTWqMkfP56iuZg1w',
  },
];

export interface YouTubeEmbedDetails {
  embedSrc: string;
  videoId?: string;
  playlistId?: string;
  isPlaylist: boolean;
}

/**
 * Safely extracts video and playlist IDs from YouTube URLs, shortlinks, or raw IDs,
 * returning a clean iframe embed URL configured for background audio playback.
 */
export function parseYouTubeEmbedInfo(inputUrl?: string): YouTubeEmbedDetails | null {
  if (!inputUrl) return null;
  const trimmed = inputUrl.trim();
  if (!trimmed) return null;

  try {
    // If it's already an embed URL
    if (trimmed.includes('youtube.com/embed/')) {
      const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      urlObj.searchParams.set('autoplay', '1');
      urlObj.searchParams.set('enablejsapi', '1');
      urlObj.searchParams.set('playsinline', '1');
      return {
        embedSrc: urlObj.toString(),
        isPlaylist: trimmed.includes('list=') || trimmed.includes('videoseries'),
      };
    }

    let videoId: string | null = null;
    let playlistId: string | null = null;

    // Check if the input is a direct playlist ID (e.g. PL... or RD... or OL...)
    if ((trimmed.startsWith('PL') || trimmed.startsWith('RD') || trimmed.startsWith('OL')) && !trimmed.includes('/') && !trimmed.includes('?')) {
      playlistId = trimmed;
    } else {
      // Parse as standard URL
      const urlString = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const urlObj = new URL(urlString);

      // Support youtube.com, youtu.be, and music.youtube.com
      playlistId = urlObj.searchParams.get('list');
      videoId = urlObj.searchParams.get('v');

      // Check shortlinks: youtu.be/<id>
      if (!videoId && (urlObj.hostname.includes('youtu.be') || urlObj.pathname.includes('/live/') || urlObj.pathname.includes('/v/'))) {
        const segments = urlObj.pathname.split('/').filter(Boolean);
        if (segments.length > 0 && segments[segments.length - 1] !== 'videoseries') {
          videoId = segments[segments.length - 1];
        }
      }
    }

    // 1. YouTube Playlist embed
    if (playlistId) {
      if (videoId) {
        // Video within a playlist
        const params = new URLSearchParams({
          list: playlistId,
          autoplay: '1',
          enablejsapi: '1',
          loop: '1',
          playsinline: '1',
        });
        return {
          embedSrc: `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`,
          videoId,
          playlistId,
          isPlaylist: true,
        };
      }

      // Pure playlist (videoseries)
      const params = new URLSearchParams({
        list: playlistId,
        autoplay: '1',
        enablejsapi: '1',
        loop: '1',
        playsinline: '1',
      });
      return {
        embedSrc: `https://www.youtube.com/embed/videoseries?${params.toString()}`,
        playlistId,
        isPlaylist: true,
      };
    }

    // 2. Single Video embed
    if (videoId) {
      const params = new URLSearchParams({
        autoplay: '1',
        enablejsapi: '1',
        loop: '1',
        playlist: videoId, // Required by YouTube iframe API for loop to function on single video
        playsinline: '1',
      });
      return {
        embedSrc: `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`,
        videoId,
        isPlaylist: false,
      };
    }

    // 3. Fallback: Check if string itself is an 11-char video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      const params = new URLSearchParams({
        autoplay: '1',
        enablejsapi: '1',
        loop: '1',
        playlist: trimmed,
        playsinline: '1',
      });
      return {
        embedSrc: `https://www.youtube.com/embed/${encodeURIComponent(trimmed)}?${params.toString()}`,
        videoId: trimmed,
        isPlaylist: false,
      };
    }
  } catch (err) {
    console.warn('Failed to parse YouTube URL:', err);
  }

  return null;
}
