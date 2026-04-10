'use client';

import { useEffect } from 'react';

export default function ClickTracker() {
  useEffect(() => {
    // Track page visit on mount
    const trackVisit = async () => {
      try {
        // Get source from URL parameter if present
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('source') || 'direct';

        await fetch('/api/track-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source }),
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error('Click tracking failed:', error);
      }
    };

    trackVisit();
  }, []);

  return null; // This component doesn't render anything
}
