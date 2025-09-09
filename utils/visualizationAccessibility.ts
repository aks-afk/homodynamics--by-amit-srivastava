// Utility functions for visualization accessibility

export interface AccessibilityConfig {
  title: string;
  description: string;
  instructions?: string;
  keyboardInstructions?: string;
  alternativeText?: string;
}

export const addVisualizationAccessibility = (
  svgElement: SVGSVGElement,
  config: AccessibilityConfig
): void => {
  // Add ARIA role and label
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-label', config.title);
  
  // Add description
  if (config.description) {
    const descId = `desc-${Math.random().toString(36).substr(2, 9)}`;
    svgElement.setAttribute('aria-describedby', descId);
    
    const desc = document.createElement('desc');
    desc.id = descId;
    desc.textContent = config.description;
    svgElement.insertBefore(desc, svgElement.firstChild);
  }
  
  // Add title
  const title = document.createElement('title');
  title.textContent = config.title;
  svgElement.insertBefore(title, svgElement.firstChild);
  
  // Make focusable for keyboard navigation
  svgElement.setAttribute('tabindex', '0');
  
  // Add keyboard instructions if provided
  if (config.keyboardInstructions) {
    svgElement.setAttribute('aria-keyshortcuts', config.keyboardInstructions);
  }
};

export const addInteractiveElementAccessibility = (
  element: Element,
  label: string,
  description?: string,
  role: string = 'button'
): void => {
  element.setAttribute('role', role);
  element.setAttribute('aria-label', label);
  element.setAttribute('tabindex', '0');
  
  if (description) {
    element.setAttribute('aria-description', description);
  }
  
  // Add keyboard event handlers
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (element as HTMLElement).click();
    }
  });
};

export const announceStateChange = (message: string): void => {
  // Create a live region for screen reader announcements
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  
  // Announce the message
  announcement.textContent = message;
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const getColorContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd want a more robust color parsing library
  const getLuminance = (color: string): number => {
    // This is a simplified version - in practice you'd parse hex/rgb values properly
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const respectsReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const createAccessibleButton = (
  text: string,
  onClick: () => void,
  ariaLabel?: string
): HTMLButtonElement => {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('aria-label', ariaLabel || text);
  button.addEventListener('click', onClick);
  
  // Apply consistent styling
  button.style.display = 'block';
  button.style.width = '100%';
  button.style.padding = '0.75rem';
  button.style.fontSize = '1rem';
  button.style.cursor = 'pointer';
  button.style.background = '#FCFBF8';
  button.style.color = '#3A3A3A';
  button.style.border = '1px solid #C1C1C1';
  button.style.borderRadius = '4px';
  button.style.fontFamily = 'Georgia, serif';
  button.style.transition = 'background 0.2s ease';
  
  // Add focus styles
  button.addEventListener('focus', () => {
    button.style.outline = '2px solid #E8B57C';
    button.style.outlineOffset = '2px';
  });
  
  button.addEventListener('blur', () => {
    button.style.outline = 'none';
  });
  
  return button;
};

export const addVisualizationKeyboardNavigation = (
  container: HTMLElement,
  interactiveElements: Element[],
  onNavigate?: (index: number) => void
): void => {
  let currentIndex = -1;
  
  const focusElement = (index: number) => {
    if (index >= 0 && index < interactiveElements.length) {
      (interactiveElements[index] as HTMLElement).focus();
      currentIndex = index;
      if (onNavigate) onNavigate(index);
    }
  };
  
  container.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Tab':
        // Let default tab behavior handle this
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusElement((currentIndex + 1) % interactiveElements.length);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusElement(currentIndex <= 0 ? interactiveElements.length - 1 : currentIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusElement(0);
        break;
      case 'End':
        event.preventDefault();
        focusElement(interactiveElements.length - 1);
        break;
    }
  });
};