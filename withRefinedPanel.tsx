import React, { ComponentType, useState, useEffect } from 'react';
import RefinedVisualizationPanel from './RefinedVisualizationPanel';

interface VisualizationMetadata {
  title: string;
  description?: string;
  loadingMessage?: string;
  errorMessage?: string;
}

interface WithRefinedPanelProps {
  metadata?: VisualizationMetadata;
  simulateLoading?: boolean;
  loadingDuration?: number;
  className?: string;
}

const withRefinedPanel = <P extends object>(
  WrappedComponent: ComponentType<P>,
  defaultMetadata: VisualizationMetadata
) => {
  const WithRefinedPanelComponent: React.FC<P & WithRefinedPanelProps> = ({
    metadata,
    simulateLoading = false,
    loadingDuration = 1000,
    className,
    ...props
  }) => {
    const [isLoading, setIsLoading] = useState(simulateLoading);
    const [hasError, setHasError] = useState(false);

    const finalMetadata = { ...defaultMetadata, ...metadata };

    useEffect(() => {
      if (simulateLoading) {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, loadingDuration);

        return () => clearTimeout(timer);
      }
    }, [simulateLoading, loadingDuration]);

    const handleRetry = () => {
      setHasError(false);
      setIsLoading(true);
      
      // Simulate retry loading
      setTimeout(() => {
        setIsLoading(false);
        // For demo purposes, randomly succeed or fail
        setHasError(Math.random() > 0.7);
      }, 1000);
    };

    return (
      <RefinedVisualizationPanel
        title={finalMetadata.title}
        description={finalMetadata.description}
        isLoading={isLoading}
        hasError={hasError}
        errorMessage={finalMetadata.errorMessage}
        onRetry={handleRetry}
        className={className}
      >
        <WrappedComponent {...(props as P)} />
      </RefinedVisualizationPanel>
    );
  };

  WithRefinedPanelComponent.displayName = `withRefinedPanel(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithRefinedPanelComponent;
};

export default withRefinedPanel;