import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';

export interface FloatingAICompanionButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export const FloatingAICompanionButton: React.FC<FloatingAICompanionButtonProps> = ({
  onClick,
  isOpen = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // If drawer is open, keep hidden to prevent visual clutter
  if (isOpen) {
    return null;
  }

  const showTooltip = isHovered || isFocused;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 990,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexDirection: 'row-reverse',
        pointerEvents: 'none',
      }}
    >
      {/* Floating Circular Action Button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Open AI Study Companion"
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1D8DEA 0%, #0284C7 50%, #2563EB 100%)',
          border: '2px solid rgba(255, 255, 255, 0.85)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: showTooltip
            ? '0 12px 30px rgba(29, 141, 234, 0.5), 0 4px 10px rgba(0, 0, 0, 0.12)'
            : '0 8px 24px rgba(29, 141, 234, 0.38), 0 2px 6px rgba(0, 0, 0, 0.08)',
          transform: showTooltip
            ? 'translateY(-3px) scale(1.06)'
            : 'translateY(0) scale(1)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
        }}
      >
        {/* Ambient Pulsing Aura Behind Icon */}
        <div
          style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(29, 141, 234, 0.4), rgba(37, 99, 235, 0.2))',
            filter: 'blur(6px)',
            zIndex: -1,
            opacity: showTooltip ? 1 : 0.6,
            transition: 'opacity 0.25s ease',
          }}
        />

        {/* AI Bot Icon */}
        <Bot size={26} strokeWidth={2.2} />

        {/* Sparkle / Online Status Indicator Badge */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            border: '2px solid #FFFFFF',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="AI Companion Ready"
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
            }}
          />
        </div>
      </button>

      {/* Floating Hover Label / Tooltip */}
      <div
        style={{
          pointerEvents: 'auto',
          opacity: showTooltip ? 1 : 0,
          transform: showTooltip ? 'translateX(0) scale(1)' : 'translateX(8px) scale(0.95)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '8px 14px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        <Sparkles size={14} color="#60A5FA" />
        <span>AI Companion</span>
      </div>
    </div>
  );
};
