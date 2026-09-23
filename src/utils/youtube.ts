export interface YouTubeAudioPreset {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
}

export const YOUTUBE_AUDIO_PRESETS: YouTubeAudioPreset[] = [
  {
    id: 'lofi',
    title: 'Lofi Girl Beats',
    description: 'Chill focus & study beats (24/7 stream)',
    icon: '🎧',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  },
  {
    id: 'piano-rain',
    title: 'Rain & Soft Piano',
    description: 'Gentle raindrops & calming piano chords',
    icon: '🌧️',
    url: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
  },
  {
    id: 'forest',
    title: 'Deep Nature Forest',
    description: 'Birds chirping, wind & rustling leaves',
    icon: '🌲',
    url: 'https://www.youtube.com/watch?v=xNN7iTA57jM',
  },
  {
    id: 'classical',
    title: 'Classical Focus',
    description: 'Mozart, Chopin & Bach for deep cognitive work',
    icon: '🎻',
    url: 'https://www.youtube.com/watch?v=4Tr0ovkx_-I',
  },
  {
    id: 'synthwave',
    title: 'Synthwave / Cyber Chill',
    description: 'Atmospheric electronic flow state music',
    icon: '🚀',
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
  },
];

export interface YouTubeEmbedDetails {
  embedSrc: string;
  videoId?: string;
  playlistId?: string;
  isPlaylist: boolean;
}

/**
 * Extracts video/playlist IDs and generates safe, valid iframe embed URL with JS API enabled.
 */
export function parseYouTubeEmbedInfo(inputUrl?: string): YouTubeEmbedDetails | null {
  if (!inputUrl) return null;
  const trimmed = inputUrl.trim();
  if (!trimmed) return null;

  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';

    // If already an embed URL
    if (trimmed.includes('youtube.com/embed/')) {
      const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      urlObj.searchParams.set('autoplay', '1');
      urlObj.searchParams.set('enablejsapi', '1');
      urlObj.searchParams.set('origin', origin);
      return {
        embedSrc: urlObj.toString(),
        isPlaylist: trimmed.includes('list='),
      };
    }

    let videoId: string | null = null;
    let playlistId: string | null = null;

    // Direct playlist ID format
    if (trimmed.startsWith('PL') && !trimmed.includes('/') && !trimmed.includes('?')) {
      playlistId = trimmed;
    } else {
      // Parse URL
      const urlString = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      const urlObj = new URL(urlString);

      // Check playlist in query params
      playlistId = urlObj.searchParams.get('list');
      videoId = urlObj.searchParams.get('v');

      // Check shortlinks: youtu.be/<id>
      if (!videoId && (urlObj.hostname.includes('youtu.be') || urlObj.pathname.includes('/live/') || urlObj.pathname.includes('/v/'))) {
        const segments = urlObj.pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          videoId = segments[segments.length - 1];
        }
      }
    }

    if (playlistId) {
      const params = new URLSearchParams({
        list: playlistId,
        autoplay: '1',
        enablejsapi: '1',
        loop: '1',
        controls: '0',
        origin,
      });

      if (videoId) {
        return {
          embedSrc: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`,
          videoId,
          playlistId,
          isPlaylist: true,
        };
      }

      return {
        embedSrc: `https://www.youtube-nocookie.com/embed/videoseries?${params.toString()}`,
        playlistId,
        isPlaylist: true,
      };
    }

    if (videoId) {
      const params = new URLSearchParams({
        autoplay: '1',
        enablejsapi: '1',
        loop: '1',
        playlist: videoId, // Required by YouTube iframe API to loop a single video
        controls: '0',
        origin,
      });

      return {
        embedSrc: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`,
        videoId,
        isPlaylist: false,
      };
    }

    // Fallback: check if the string itself is an 11-char video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      const params = new URLSearchParams({
        autoplay: '1',
        enablejsapi: '1',
        loop: '1',
        playlist: trimmed,
        controls: '0',
        origin,
      });
      return {
        embedSrc: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(trimmed)}?${params.toString()}`,
        videoId: trimmed,
        isPlaylist: false,
      };
    }
  } catch (err) {
    console.warn('Failed to parse YouTube URL:', err);
  }

  return null;
}
