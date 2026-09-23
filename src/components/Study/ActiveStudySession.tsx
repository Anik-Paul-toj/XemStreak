import React, { useState, useEffect, useRef } from 'react';
import type { StudySession, TreeStage, TreeCustomization } from '../../types';
import { TreeDisplay } from '../Tree/TreeDisplay';
import { Button } from '../UI/Button';
import { ProgressBar } from '../UI/ProgressBar';
import { Play, Pause, CheckCircle2, X, Maximize2, Minimize2, Sparkles, Music, Volume2, VolumeX } from 'lucide-react';
import { parseYouTubeEmbedInfo } from '../../utils/youtube';

export interface ActiveStudySessionProps {
  session: StudySession;
  elapsedSeconds: number;
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onCancel: () => void;
  treeStage: TreeStage;
  customization?: TreeCustomization;
}

export const ActiveStudySession: React.FC<ActiveStudySessionProps> = ({
  session,
  elapsedSeconds,
  isRunning,
  onPause,
  onResume,
  onFinish,
  onCancel,
  treeStage,
  customization,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedInfo = parseYouTubeEmbedInfo(session.youtubeUrl);

  // Sync YouTube audio playback with timer state (pause/resume)
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    const command = isRunning ? 'playVideo' : 'pauseVideo';
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      );
    } catch (e) {
      console.warn('YouTube postMessage error:', e);
    }
  }, [isRunning]);

  const toggleAudioMute = () => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    const command = nextMuted ? 'mute' : 'unMute';
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      );
    } catch (e) {
      console.warn('YouTube postMessage mute error:', e);
    }
  };

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      // Clean up fullscreen on unmount if still active
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setShowPrompt(false);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  };

  // Format elapsed time HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  };

  // Leaves earned so far in this session
  const leavesAccrued = elapsedSeconds < 180 ? 0 : Math.max(1, Math.floor(elapsedSeconds / 900));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: isFullscreen ? '#F8FAFD' : 'var(--color-surface)',
        backgroundImage: isFullscreen
          ? 'radial-gradient(ellipse at 50% 40%, rgba(29, 141, 234, 0.08) 0%, #F6F9FE 80%)'
          : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isFullscreen ? '40px 24px' : '24px',
        overflowY: 'auto',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Top Bar with Status, Fullscreen Toggle & Exit */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="animate-pulse-live"
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isRunning ? 'var(--color-success)' : 'var(--color-amber)',
              display: 'inline-block',
            }}
          />
          <span className="label-sm" style={{ color: 'var(--color-muted)' }}>
            {isRunning ? (isFullscreen ? 'ZEN FOCUS MODE (FULLSCREEN)' : 'FOCUS MODE ACTIVE') : 'TIMER PAUSED'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            style={{
              background: isFullscreen ? 'var(--color-primary-light)' : 'var(--color-neutral)',
              border: '1px solid var(--color-border)',
              color: isFullscreen ? 'var(--color-primary)' : 'var(--color-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              padding: '7px 14px',
              borderRadius: 'var(--rounded-full)',
              boxShadow: 'var(--shadow-subtle)',
              transition: 'all 0.2s ease',
            }}
            title={isFullscreen ? "Exit Fullscreen (or press Esc)" : "Enter Zen Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
          </button>

          {/* Cancel / Exit Session */}
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              padding: '8px 12px',
              borderRadius: 'var(--rounded-md)',
            }}
            title="Cancel session without saving"
          >
            <X size={16} />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Prompt Banner (When timer starts, if not in fullscreen) */}
      {!isFullscreen && showPrompt && (
        <div
          style={{
            position: 'absolute',
            top: '76px',
            backgroundColor: 'var(--color-neutral)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--rounded-full)',
            padding: '6px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-card)',
            animation: 'fadeIn 0.3s ease-out',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-muted)' }}>
            <Sparkles size={15} color="var(--color-primary)" />
            <span>Maximize focus with <strong>Zen Fullscreen</strong> mode?</span>
          </div>

          <button
            onClick={toggleFullscreen}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--rounded-full)',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Maximize2 size={12} />
            <span>Make Full Screen</span>
          </button>

          <button
            onClick={() => setShowPrompt(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-muted)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Dismiss tip"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Focus Console */}
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
          marginTop: '40px',
          marginBottom: '20px',
        }}
      >
        {/* Digital Stopwatch Display */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-family-base)',
              fontSize: 'clamp(54px, 10vw, 76px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-secondary)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {formatTime(elapsedSeconds)}
          </div>

          <h2
            className="headline-sm"
            style={{
              color: 'var(--color-primary)',
              marginTop: '12px',
              fontWeight: 600,
            }}
          >
            {session.title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span className="body-sm" style={{ color: 'var(--color-muted)' }}>
              🍃 +{leavesAccrued} {leavesAccrued === 1 ? 'leaf' : 'leaves'} grown this session
            </span>

            {/* Background Audio Badge / Controls */}
            {embedInfo && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-neutral)',
                  border: '1px solid var(--color-border)',
                  padding: '5px 14px',
                  borderRadius: 'var(--rounded-full)',
                  boxShadow: 'var(--shadow-subtle)',
                  fontSize: '12px',
                  marginTop: '4px',
                  animation: 'fadeIn 0.3s ease-out',
                }}
              >
                <Music
                  size={14}
                  color="var(--color-primary)"
                  style={{
                    animation: isRunning && !isAudioMuted ? 'pulse 2s infinite' : 'none',
                  }}
                />
                <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>
                  {embedInfo.isPlaylist ? 'YouTube Playlist Audio' : 'YouTube Background Audio'}
                </span>
                <span style={{ color: 'var(--color-muted)', fontSize: '11px' }}>
                  • {isRunning ? (isAudioMuted ? 'Muted' : 'Playing') : 'Paused with timer'}
                </span>
                <button
                  type="button"
                  onClick={toggleAudioMute}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: isAudioMuted ? 'var(--color-error)' : 'var(--color-primary)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    marginLeft: '2px',
                  }}
                  title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Target Progress Bar (if targetSeconds > 0) */}
        {session.targetSeconds > 0 && (
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <ProgressBar
              current={elapsedSeconds}
              max={session.targetSeconds}
              height={10}
              showLabel={true}
            />
          </div>
        )}

        {/* Tree Visual in Active State */}
        <div style={{ width: '100%', maxWidth: isFullscreen ? '460px' : '360px', transition: 'max-width 0.3s ease' }}>
          <TreeDisplay
            stage={treeStage}
            state={isRunning ? 'active_studying' : 'idle'}
            customization={customization}
            size={isFullscreen ? 'lg' : 'md'}
            showDetails={false}
          />
        </div>

        {/* Timer Control Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          {isRunning ? (
            <Button
              variant="secondary"
              size="lg"
              icon={<Pause size={20} />}
              onClick={onPause}
              style={{ flex: 1 }}
            >
              Pause
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              icon={<Play size={20} fill="currentColor" />}
              onClick={onResume}
              style={{ flex: 1 }}
            >
              Resume
            </Button>
          )}

          <Button
            variant="primary"
            size="lg"
            icon={<CheckCircle2 size={20} />}
            onClick={onFinish}
            style={{
              flex: 1.2,
              backgroundColor: 'var(--color-success)',
              boxShadow: '0 4px 14px rgba(24, 184, 90, 0.3)',
            }}
          >
            Finish & Save
          </Button>
        </div>
      </div>

      {/* Invisible Background YouTube Audio Stream (Plays ONLY while session is active) */}
      {embedInfo && (
        <iframe
          ref={iframeRef}
          src={embedInfo.embedSrc}
          title="Background YouTube Audio Stream"
          allow="autoplay; encrypted-media"
          tabIndex={-1}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: '-5000px',
            left: '-5000px',
            width: '1px',
            height: '1px',
            opacity: 0.001,
            pointerEvents: 'none',
            border: 'none',
          }}
        />
      )}
    </div>
  );
};
