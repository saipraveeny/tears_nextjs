"use client";

import React, { useRef, useEffect } from 'react';
import { Player } from '@remotion/player';
import { useLenis } from 'lenis/react';
import BottleSequence from '@/remotion/BottleSequence';

const DURATION_IN_FRAMES = 900; // 30fps * 30s = smooth 900 frames interpolation over full scroll length
const FPS = 30;

const RemotionPlayer = () => {
  const playerRef = useRef(null);

  // Subscribe to Lenis scroll and map exactly to video frames!
  useLenis(({ progress }) => {
    if (playerRef.current) {
      // Mapping the 0.0 - 1.0 scroll progress to the total frame count
      // using a tiny bit of math magic.
      const targetFrame = Math.max(0, Math.min(DURATION_IN_FRAMES - 1, Math.floor(progress * DURATION_IN_FRAMES)));
      // @ts-ignore
      playerRef.current.seekTo(targetFrame);
    }
  });

  return (
    <div 
      className="remotion-background-container" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Sits natively underneath our whole UI!
        pointerEvents: 'none' // Ensures users can still click the UI on top
      }}
    >
      <Player
        ref={playerRef}
        component={BottleSequence}
        durationInFrames={DURATION_IN_FRAMES}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={FPS}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        // We explicitly turn off standard playback controls since this is scroll-bound
        controls={false}
        autoPlay={false}
      />
    </div>
  );
};

export default RemotionPlayer;
