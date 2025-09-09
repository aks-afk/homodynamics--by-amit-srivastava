/**
 * Monitoring Dashboard Component
 * Displays performance metrics, errors, and analytics data for debugging
 * Only shown in development/debug mode
 */

import React, { useState, useEffect } from 'react';
import { webVitalsTracker } from '../utils/webVitals';
import { errorMonitor } from '../utils/errorMonitoring';
import { analytics } from '../utils/analytics';

interface MonitoringDashboardProps {
  isVisible: boolean;
  onToggle: () => void;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ isVisible, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'performance' | 'errors' | 'analytics'>('performance');
  const [webVitals, setWebVitals] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    if (isVisible) {
      // Refresh data when dashboard becomes visible
      refreshData();
      
      // Set up periodic refresh
      const interval = setInterval(refreshData, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const refreshData = () => {
    setWebVitals(webVitalsTracker.getStoredMetrics());
    setErrors(errorMonitor.getStoredErrors());
    setAnalyticsData(analytics.getAnalyticsStats());
  };

  const clearAllData = () => {
    webVitalsTracker.getStoredMetrics(); // This doesn't clear, but we could add a clear method
    errorMonitor.clearErrors();
    analytics.clearData();
    refreshData();
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50 text-sm"
        title="Open Monitoring Dashboard"
      >
        📊 Monitor
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Monitoring Dashboard</h2>
          <div className="flex gap-2">
            <button
              onClick={refreshData}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              🔄 Refresh
            </button>
            <button
              onClick={clearAllData}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              🗑️ Clear
            </button>
            <button
              onClick={onToggle}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'performance', label: '📊 Performance', count: webVitals.length },
              { id: 'errors', label: '🚨 Errors', count: errors.length },
              { id: 'analytics', label: '📈 Analytics', count: analyticsData?.eventsCount || 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'performance' && (
            <PerformanceTab webVitals={webVitals} />
          )}
          {activeTab === 'errors' && (
            <ErrorsTab errors={errors} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab analyticsData={analyticsData} />
          )}
        </div>
      </div>
    </div>
  );
};

const PerformanceTab: React.FC<{ webVitals: any[] }> = ({ webVitals }) => {
  const getMetricColor = (name: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'CLS': { good: 0.1, poor: 0.25 },
      'FID': { good: 100, poor: 300 },
      'FCP': { good: 1800, poor: 3000 },
      'LCP': { good: 2500, poor: 4000 },
      'TTFB': { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name];
    if (!threshold) return 'text-gray-600';

    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Core Web Vitals</h3>
      
      {webVitals.length === 0 ? (
        <p className="text-gray-500">No performance metrics collected yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {webVitals.slice(-10).map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-gray-900">{metric.name}</h4>
                <span className={`font-mono text-sm ${getMetricColor(metric.name, metric.value)}`}>
                  {metric.value.toFixed(2)}
                  {metric.name === 'CLS' ? '' : 'ms'}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(metric.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                URL: {metric.url}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ErrorsTab: React.FC<{ errors: any[] }> = ({ errors }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Error Reports</h3>
      
      {errors.length === 0 ? (
        <p className="text-gray-500">No errors reported. Great job! 🎉</p>
      ) : (
        <div className="space-y-3">
          {errors.slice(-10).reverse().map((error, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 flex-1 mr-4">{error.message}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(error.severity)}`}>
                  {error.severity}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                <div>Type: {error.type}</div>
                <div>Time: {new Date(error.timestamp).toLocaleString()}</div>
                {error.line && <div>Line: {error.line}:{error.column}</div>}
              </div>
              
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {error.stack}
                  </pre>
                </details>
              )}
              
              {error.context && Object.keys(error.context).length > 0 && (
                <details className="mt-2">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    Context
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(error.context, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AnalyticsTab: React.FC<{ analyticsData: any }> = ({ analyticsData }) => {
  const session = analytics.getSession();
  const events = analytics.getStoredEvents();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
      
      {/* Session Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Current Session</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Duration</div>
            <div className="font-medium">{Math.round(session.timeSpent / 1000)}s</div>
          </div>
          <div>
            <div className="text-gray-500">Page Views</div>
            <div className="font-medium">{session.pageViews}</div>
          </div>
          <div>
            <div className="text-gray-500">Interactions</div>
            <div className="font-medium">{session.interactions}</div>
          </div>
          <div>
            <div className="text-gray-500">Events</div>
            <div className="font-medium">{analyticsData?.eventsCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Events by Category */}
      {analyticsData?.eventsByCategory && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Events by Category</h4>
          <div className="space-y-2">
            {Object.entries(analyticsData.eventsByCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center text-sm">
                <span className="capitalize">{category}</span>
                <span className="font-medium">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Recent Events</h4>
        {events.length === 0 ? (
          <p className="text-gray-500">No events tracked yet.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {events.slice(-20).reverse().map((event, index) => (
              <div key={index} className="bg-gray-50 rounded p-3 text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{event.action}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-600">
                  {event.category} • {event.label || 'No label'}
                </div>
                {event.value && (
                  <div className="text-gray-500 text-xs">Value: {event.value}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringDashboard;