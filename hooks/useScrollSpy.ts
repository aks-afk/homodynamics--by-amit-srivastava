import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollSpyOptions {
  rootMargin?: string;
  threshold?: number | number[];
  debounceMs?: number;
}

interface ScrollSpyElement {
  id: string;
  element: Element;
  isVisible: boolean;
  intersectionRatio: number;
}

export const useScrollSpy = (
  elementIds: string[],
  options: ScrollSpyOptions = {}
) => {
  const {
    rootMargin = '-90px 0px -50% 0px', // Account for header and center detection
    threshold = [0, 0.1, 0.25, 0.5, 0.75, 1],
    debounceMs = 100
  } = options;

  const [activeId, setActiveId] = useState<string>('');
  const [visibleElements, setVisibleElements] = useState<ScrollSpyElement[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<string, Element>>(new Map());
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounced update function
  const debouncedUpdate = useCallback((entries: IntersectionObserverEntry[]) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      // Update visible elements state
      const newVisibleElements: ScrollSpyElement[] = entries.map(entry => ({
        id: entry.target.id,
        element: entry.target,
        isVisible: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio
      }));

      setVisibleElements(newVisibleElements);

      if (visibleEntries.length > 0) {
        // Find the element with the highest intersection ratio
        const mostVisible = visibleEntries.reduce((prev, current) => {
          return current.intersectionRatio > prev.intersectionRatio ? current : prev;
        });

        // Only update if it's different from current active
        if (mostVisible.target.id !== activeId) {
          setActiveId(mostVisible.target.id);
        }
      } else {
        // If no elements are visible, find the closest one above the viewport
        const elementsAbove = entries.filter(entry => {
          const rect = entry.target.getBoundingClientRect();
          return rect.bottom < window.innerHeight / 2;
        });

        if (elementsAbove.length > 0) {
          // Get the last element that's above the viewport
          const lastAbove = elementsAbove.reduce((prev, current) => {
            const prevRect = prev.target.getBoundingClientRect();
            const currentRect = current.target.getBoundingClientRect();
            return currentRect.top > prevRect.top ? current : prev;
          });

          if (lastAbove.target.id !== activeId) {
            setActiveId(lastAbove.target.id);
          }
        }
      }
    }, debounceMs);
  }, [activeId, debounceMs]);

  // Initialize observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(debouncedUpdate, {
      rootMargin,
      threshold
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedUpdate, rootMargin, threshold]);

  // Observe elements
  useEffect(() => {
    if (!observerRef.current) return;

    // Clear previous observations
    observerRef.current.disconnect();
    elementsRef.current.clear();

    // Find and observe new elements
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        elementsRef.current.set(id, element);
        observerRef.current!.observe(element);
      }
    });

    // Set initial active element if none is set
    if (!activeId && elementIds.length > 0) {
      const firstElement = document.getElementById(elementIds[0]);
      if (firstElement) {
        const rect = firstElement.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          setActiveId(elementIds[0]);
        }
      }
    }
  }, [elementIds, activeId]);

  // Smooth scroll to element
  const scrollToElement = useCallback((elementId: string, offset: number = 90) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update active element immediately for better UX
      setActiveId(elementId);
    }
  }, []);

  // Get scroll progress for current section
  const getScrollProgress = useCallback((elementId: string): number => {
    const element = document.getElementById(elementId);
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const elementHeight = rect.height;
    const viewportHeight = window.innerHeight;
    
    // Calculate how much of the element has been scrolled past
    const scrolledPast = Math.max(0, -rect.top);
    const visibleHeight = Math.min(elementHeight, viewportHeight - Math.max(0, rect.top));
    
    if (elementHeight <= viewportHeight) {
      // For short elements, base progress on position in viewport
      return Math.max(0, Math.min(1, (viewportHeight / 2 - rect.top) / (viewportHeight / 2)));
    } else {
      // For long elements, base progress on how much has been scrolled
      return Math.max(0, Math.min(1, scrolledPast / (elementHeight - viewportHeight)));
    }
  }, []);

  return {
    activeId,
    visibleElements,
    scrollToElement,
    getScrollProgress,
    isElementVisible: (elementId: string) => 
      visibleElements.find(el => el.id === elementId)?.isVisible || false,
    getIntersectionRatio: (elementId: string) => 
      visibleElements.find(el => el.id === elementId)?.intersectionRatio || 0
  };
};