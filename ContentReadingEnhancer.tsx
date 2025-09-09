import React, { useState, useEffect, useRef } from 'react';

interface ContentReadingEnhancerProps {
  children: React.ReactNode;
  enableFocusMode?: boolean;
  optimalWidth?: boolean;
  enhancedTypography?: boolean;
}

interface ReadingSettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  maxWidth: string;
  focusMode: boolean;
}

const ContentReadingEnhancer: React.FC<ContentReadingEnhancerProps> = ({
  children,
  enableFocusMode = true,
  optimalWidth = true,
  enhancedTypography = true
}) => {
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 18, // Base font size in px
    lineHeight: 1.625,
    letterSpacing: 0,
    maxWidth: '65ch',
    focusMode: false
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide settings button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSettingsOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Focus mode toggle: Ctrl/Cmd + Shift + F
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
        event.preventDefault();
        setSettings(prev => ({ ...prev, focusMode: !prev.focusMode }));
      }
      
      // Font size adjustments: Ctrl/Cmd + Plus/Minus
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
        if (event.key === '=' || event.key === '+') {
          event.preventDefault();
          setSettings(prev => ({ 
            ...prev, 
            fontSize: Math.min(prev.fontSize + 1, 24) 
          }));
        } else if (event.key === '-') {
          event.preventDefault();
          setSettings(prev => ({ 
            ...prev, 
            fontSize: Math.max(prev.fontSize - 1, 14) 
          }));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    transition: 'all var(--transition-normal)',
    ...(optimalWidth && {
      maxWidth: settings.maxWidth,
      margin: '0 auto',
    }),
    ...(settings.focusMode && {
      backgroundColor: 'var(--color-surface)',
      padding: 'var(--space-8)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--color-border)',
    }),
  };

  const enhancedTextStyle: React.CSSProperties = enhancedTypography ? {
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
    letterSpacing: `${settings.letterSpacing}em`,
    transition: 'all var(--transition-normal)',
    fontFamily: 'var(--font-family-primary)',
    color: 'var(--color-text-secondary)',
  } : {};

  const focusModeOverlayStyle: React.CSSProperties = settings.focusMode ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(2px)',
    zIndex: 500,
    pointerEvents: 'none',
  } : { display: 'none' };

  const settingsButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 'var(--space-6)',
    right: 'var(--space-6)',
    width: '48px',
    height: '48px',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--text-lg)',
    color: 'var(--color-text-secondary)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 600,
    transition: 'all var(--transition-fast)',
    opacity: isScrolled ? 1 : 0,
    transform: isScrolled ? 'translateY(0)' : 'translateY(20px)',
    pointerEvents: isScrolled ? 'auto' : 'none',
  };

  const settingsPanelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 'var(--space-20)',
    right: 'var(--space-6)',
    width: '280px',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 700,
    opacity: isSettingsOpen ? 1 : 0,
    transform: isSettingsOpen ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all var(--transition-normal)',
    pointerEvents: isSettingsOpen ? 'auto' : 'none',
    backdropFilter: 'blur(8px)',
  };

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: 'var(--color-border)',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  };

  const toggleButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-3)',
    backgroundColor: settings.focusMode ? 'var(--color-accent)' : 'var(--color-surface-subtle)',
    color: settings.focusMode ? 'var(--color-surface)' : 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-weight-medium)',
    transition: 'all var(--transition-fast)',
  };

  return (
    <>
      {/* Focus mode overlay */}
      <div style={focusModeOverlayStyle} />
      
      {/* Main content container */}
      <div 
        ref={containerRef}
        style={containerStyle}
        className={`content-reading-enhancer ${settings.focusMode ? 'focus-mode' : ''}`}
      >
        <div style={enhancedTextStyle}>
          {children}
        </div>
      </div>

      {/* Settings button */}
      <button
        style={settingsButtonStyle}
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        aria-label="Reading settings"
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-subtle)';
          (e.target as HTMLElement).style.color = 'var(--color-text-primary)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface)';
          (e.target as HTMLElement).style.color = 'var(--color-text-secondary)';
        }}
      >
        📖
      </button>

      {/* Settings panel */}
      <div ref={settingsRef} style={settingsPanelStyle}>
        <h4 style={{
          margin: '0 0 var(--space-4) 0',
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)',
        }}>
          Reading Settings
        </h4>

        {/* Font Size */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}>
            Font Size: {settings.fontSize}px
          </label>
          <input
            type="range"
            min="14"
            max="24"
            value={settings.fontSize}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              fontSize: parseInt(e.target.value) 
            }))}
            style={sliderStyle}
          />
        </div>

        {/* Line Height */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}>
            Line Height: {settings.lineHeight.toFixed(2)}
          </label>
          <input
            type="range"
            min="1.2"
            max="2.0"
            step="0.05"
            value={settings.lineHeight}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              lineHeight: parseFloat(e.target.value) 
            }))}
            style={sliderStyle}
          />
        </div>

        {/* Letter Spacing */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}>
            Letter Spacing: {settings.letterSpacing.toFixed(2)}em
          </label>
          <input
            type="range"
            min="-0.05"
            max="0.1"
            step="0.01"
            value={settings.letterSpacing}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              letterSpacing: parseFloat(e.target.value) 
            }))}
            style={sliderStyle}
          />
        </div>

        {/* Reading Width */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-2)',
          }}>
            Reading Width
          </label>
          <select
            value={settings.maxWidth}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              maxWidth: e.target.value 
            }))}
            style={{
              width: '100%',
              padding: 'var(--space-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <option value="55ch">Narrow (55ch)</option>
            <option value="65ch">Optimal (65ch)</option>
            <option value="75ch">Wide (75ch)</option>
            <option value="100%">Full Width</option>
          </select>
        </div>

        {/* Focus Mode Toggle */}
        {enableFocusMode && (
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <button
              style={toggleButtonStyle}
              onClick={() => setSettings(prev => ({ 
                ...prev, 
                focusMode: !prev.focusMode 
              }))}
              onMouseEnter={(e) => {
                if (!settings.focusMode) {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--color-border)';
                }
              }}
              onMouseLeave={(e) => {
                if (!settings.focusMode) {
                  (e.target as HTMLElement).style.backgroundColor = 'var(--color-surface-subtle)';
                }
              }}
            >
              {settings.focusMode ? '✓ Focus Mode On' : 'Enable Focus Mode'}
            </button>
          </div>
        )}

        {/* Keyboard shortcuts info */}
        <div style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--line-height-snug)',
          marginTop: 'var(--space-3)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--color-border-subtle)',
        }}>
          <div><kbd>Ctrl/Cmd + Shift + F</kbd> Focus mode</div>
          <div><kbd>Ctrl/Cmd + +/-</kbd> Font size</div>
        </div>
      </div>

      {/* Custom styles for enhanced typography */}
      <style>{`
        .content-reading-enhancer.focus-mode {
          position: relative;
          z-index: 501;
        }
        
        .content-reading-enhancer p {
          font-size: ${settings.fontSize}px !important;
          line-height: ${settings.lineHeight} !important;
          letter-spacing: ${settings.letterSpacing}em !important;
          transition: all var(--transition-normal) !important;
        }
        
        .content-reading-enhancer h3,
        .content-reading-enhancer h4 {
          transition: all var(--transition-normal) !important;
        }
        
        /* Smooth transitions for all text elements */
        .content-reading-enhancer * {
          transition: font-size var(--transition-normal), 
                      line-height var(--transition-normal), 
                      letter-spacing var(--transition-normal);
        }
        
        /* Custom slider styles */
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-accent);
          cursor: pointer;
          border: 2px solid var(--color-surface);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-accent);
          cursor: pointer;
          border: 2px solid var(--color-surface);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Keyboard shortcut styling */
        kbd {
          background: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          border-radius: 3px;
          padding: 1px 4px;
          font-size: 0.8em;
          font-family: monospace;
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .content-reading-enhancer {
            max-width: 100% !important;
            padding: var(--space-4) !important;
          }
        }
      `}</style>
    </>
  );
};

export default ContentReadingEnhancer;