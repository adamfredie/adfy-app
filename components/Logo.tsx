import React from 'react';

export function Logo() {
  return (
    <img 
      // src="./images/logo.png" 
      src="/aduffy-logo.png" 
      alt="Adfy Logo" 
      width="90" 
      height="30"
      style={{ borderRadius: '1px' }}
      className="mobile-logo-img"
      decoding="async"
      fetchPriority="high"
    />
  );
} 