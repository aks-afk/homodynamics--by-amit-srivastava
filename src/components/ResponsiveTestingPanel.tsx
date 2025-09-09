import React, { useState, useEffect } from 'react';
import { 
  runResponsiveTests, 
  ResponsiveTestResult, 
  setupResponsiveMonitoring,
  generateTestingReport 
} from '../utils/responsiveTestingUtils';

interface ResponsiveTestingPanelProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const ResponsiveTestingPanel: React.FC<ResponsiveTestingPanelProps> = ({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResult, setTestResult] = useState<ResponsiveTestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [autoTest, setAutoTest] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cleanup: (() => void) | undefined;

    if (autoTest) {
      cleanup = setupResponsiveMonitoring((result) => {
        setTestResult(result);
      });
    }

    return cleanup;
  }, [enabled, autoTest]);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const result = await runResponsiveTests();
      setTestResult(result);
    } catch (error) {
      console.error('Error running responsive tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    if (!testResult) return;

    const report = generateTestingReport(testResult);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `responsive-test-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!enabled) return null;

  const getPositionStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10000,
      fontFamily: 'monospace',
      fontSize: '12px',
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: '10px', left: '10px' };
      case 'top-right':
        return { ...base, top: '10px', right: '10px' };
      case 'bottom-left':
        return { ...base, bottom: '10px', left: '10px' };
      case 'bottom-right':
      default:
        return { ...base, bottom: '10px', right: '10px' };
    }
  };

  const panelStyles: React.CSSProperties = {
    ...getPositionStyles(),
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px',
    minWidth: '300px',
    maxWidth: '400px',
    maxHeight: '500px',
    overflow: 'auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  };

  const buttonStyles: React.CSSProperties = {
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '11px',
    margin: '2px',
  };

  const toggleButtonStyles: React.CSSProperties = {
    ...getPositionStyles(),
    backgroundColor: testResult?.score ? (testResult.score >= 80 ? '#22c55e' : testResult.score >= 60 ? '#f59e0b' : '#ef4444') : '#6b7280',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  };

  if (!isOpen) {
    return (
      <button
        style={toggleButtonStyles}
        onClick={() => setIsOpen(true)}
        title="Open Responsive Testing Panel"
        aria-label="Open responsive testing panel"
      >
        📱
      </button>
    );
  }

  return (
    <div style={panelStyles}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          Responsive Testing
        </h3>
        <button
          style={{ ...buttonStyles, padding: '4px 8px' }}
          onClick={() => setIsOpen(false)}
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <button
          style={{ ...buttonStyles, backgroundColor: isRunning ? '#555' : '#0066cc' }}
          onClick={runTests}
          disabled={isRunning}
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
        
        <label style={{ display: 'flex', alignItems: 'center', marginTop: '8px', fontSize: '11px' }}>
          <input
            type="checkbox"
            checked={autoTest}
            onChange={(e) => setAutoTest(e.target.checked)}
            style={{ marginRight: '6px' }}
          />
          Auto-test on resize
        </label>
      </div>

      {testResult && (
        <div>
          <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#2a2a2a', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Score:</span>
              <span style={{ 
                color: testResult.score >= 80 ? '#22c55e' : testResult.score >= 60 ? '#f59e0b' : '#ef4444',
                fontWeight: 'bold'
              }}>
                {testResult.score}/100
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#ccc' }}>
              {testResult.viewport.width}×{testResult.viewport.height}px | {testResult.device.type} ({testResult.device.size})
            </div>
          </div>

          {testResult.issues.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#ef4444' }}>
                Issues ({testResult.issues.length})
              </h4>
              <div style={{ maxHeight: '150px', overflow: 'auto', fontSize: '10px' }}>
                {testResult.issues.slice(0, 5).map((issue, index) => (
                  <div key={index} style={{ marginBottom: '4px', padding: '4px', backgroundColor: '#2a1a1a', borderRadius: '2px' }}>
                    {issue}
                  </div>
                ))}
                {testResult.issues.length > 5 && (
                  <div style={{ color: '#888', fontStyle: 'italic' }}>
                    ...and {testResult.issues.length - 5} more issues
                  </div>
                )}
              </div>
            </div>
          )}

          {testResult.recommendations.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#f59e0b' }}>
                Recommendations
              </h4>
              <div style={{ maxHeight: '100px', overflow: 'auto', fontSize: '10px' }}>
                {testResult.recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} style={{ marginBottom: '4px', padding: '4px', backgroundColor: '#2a2a1a', borderRadius: '2px' }}>
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            style={{ ...buttonStyles, backgroundColor: '#0066cc', width: '100%' }}
            onClick={downloadReport}
          >
            Download Report
          </button>
        </div>
      )}

      <div style={{ marginTop: '12px', fontSize: '10px', color: '#888', borderTop: '1px solid #333', paddingTop: '8px' }}>
        <div>Device: {testResult?.device.touchCapable ? 'Touch' : 'Non-touch'}</div>
        <div>Orientation: {testResult?.device.orientation}</div>
      </div>
    </div>
  );
};

export default ResponsiveTestingPanel;