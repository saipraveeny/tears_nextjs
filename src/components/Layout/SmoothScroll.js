import React from 'react';
import { ReactLenis } from 'lenis/react';

const SmoothScroll = ({ children }) => {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 2.0 }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
