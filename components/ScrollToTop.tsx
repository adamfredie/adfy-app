import { useEffect } from 'react';

interface ScrollToTopProps {
  trigger?: any; // This will be the component name or any value that changes
}

export function ScrollToTop({ trigger }: ScrollToTopProps) {
  useEffect(() => {
    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [trigger]); // Now it will run whenever trigger changes

  return null;
}