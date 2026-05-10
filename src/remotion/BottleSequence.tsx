import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, Img, interpolate } from 'remotion';

// We import product images directly
import wildImg from '../assets/wild.png';
import glitchImg from '../assets/glitch.png';
import greenImg from '../assets/green.png';

const BottleSequence: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  // Progress from 0 to 1 over the clip duration
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const phaseProgress = (min: number, max: number) =>
    interpolate(progress, [min, max], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const getPhaseStyles = (min: number, max: number): React.CSSProperties => {
    const p = phaseProgress(min, max);
    
    // Smooth bell-curve opacity
    const opacity = p < 0.2 ? interpolate(p, [0, 0.2], [0, 1]) 
                  : p > 0.8 ? interpolate(p, [0.8, 1], [1, 0]) 
                  : (p > 0.2 && p < 0.8 ? 1 : 0);

    // "Premium 3D Parallax" via Y/Z scaling and rotation shifts
    const scale = interpolate(p, [0, 0.5, 1], [0.8, 1.2, 0.8]);
    const rotY = interpolate(p, [0, 1], [-20, 20]);
    const translateY = interpolate(p, [0, 0.5, 1], [300, 0, -300]);

    return {
      position: 'absolute',
      opacity,
      transform: `perspective(1000px) translateY(${translateY}px) translateZ(${scale * 100}px) rotateY(${rotY}deg)`,
      transformStyle: 'preserve-3d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    };
  };

  const glowStyle = (min: number, max: number, colorHex: string): React.CSSProperties => {
    const p = phaseProgress(min, max);
    const opacity = p < 0.2 ? interpolate(p, [0, 0.2], [0, 0.6]) 
                  : p > 0.8 ? interpolate(p, [0.8, 1], [0.6, 0]) 
                  : 0.6;
                   
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '80vmin',
      height: '80vmin',
      transform: 'translate(-50%, -50%)',
      background: `radial-gradient(circle, ${colorHex} 0%, transparent 70%)`,
      opacity,
      mixBlendMode: 'screen',
      filter: 'blur(40px)',
    };
  };

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#050505' }}>
      {/* Dynamic ambient lighting that follows scroll */}
      <div style={glowStyle(0, 0.33, '#ff3b30')} />  {/* Wild */}
      <div style={glowStyle(0.33, 0.66, '#0f222b')} /> {/* Glitch */}
      <div style={glowStyle(0.66, 1.0, '#548c50')} /> {/* Green */}

      {/* Wild Bottle (0 to 0.33) */}
      <div style={getPhaseStyles(0, 0.33)}>
        <Img 
          src={wildImg} 
          style={{ 
            height: '80%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 40px rgba(255, 59, 48, 0.5))'
          }} 
        />
      </div>

      {/* Glitch Bottle (0.33 to 0.66) */}
      <div style={getPhaseStyles(0.33, 0.66)}>
        <Img 
          src={glitchImg} 
          style={{ 
            height: '80%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 40px rgba(15, 34, 43, 0.8))'
          }} 
        />
      </div>

      {/* Green Bottle (0.66 to 1.0) */}
      <div style={getPhaseStyles(0.66, 1.0)}>
        <Img 
          src={greenImg} 
          style={{ 
            height: '80%', 
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 40px rgba(84, 140, 80, 0.5))'
          }} 
        />
      </div>

      {/* Cinematic Dust Overlay */}
      <AbsoluteFill 
        style={{ 
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none' 
        }} 
      />
    </AbsoluteFill>
  );
};

export default BottleSequence;
