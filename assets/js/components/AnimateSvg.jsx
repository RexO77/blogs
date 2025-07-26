import React, { useState, useMemo, useEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';

const AnimatedPath = ({
  d,
  stroke,
  strokeWidth,
  strokeLinecap,
  fill, // new prop
  animationType,
  colorConfig,
  isHovering,
  initialAnimation,
  delay,
}) => {
  const controls = useAnimationControls();

  useEffect(() => {
    const sequence = async () => {
      if (initialAnimation) {
        await controls.start({
          pathLength: [0, 1],
          transition: { duration: 2, ease: 'easeInOut' },
        });
      }
    };
    sequence();
  }, [controls, initialAnimation]);

  useEffect(() => {
    const hoverSequence = async () => {
      if (isHovering) {
        switch (animationType) {
          case 'float':
            controls.start({
              y: [-5, 5, -5],
              transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            });
            break;
          case 'pulse':
            controls.start({
              scale: [1, 1.1, 1],
              transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
            });
            break;
          case 'redraw':
            await controls.start({ pathLength: 0, transition: { duration: 1 } });
            await controls.start({ pathLength: 1, transition: { duration: 1 } });
            break;
          case 'color':
            controls.start({
              stroke: colorConfig.map(c => c.color),
              transition: {
                duration: colorConfig[colorConfig.length - 1].timestamp,
                times: colorConfig.map(c => c.timestamp / colorConfig[colorConfig.length - 1].timestamp),
                repeat: Infinity,
                ease: 'linear',
              },
            });
            break;
          case 'sequential':
            // Sequential animation logic here
            break;
          default:
            break;
        }
      } else {
        controls.stop();
        controls.set({ y: 0, scale: 1, stroke: stroke });
        if (initialAnimation) {
          controls.start({ pathLength: 1 });
        }
      }
    };
    hoverSequence();
  }, [isHovering, animationType, controls, colorConfig, stroke, initialAnimation]);

  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      fill={fill} // use new prop
      animate={controls}
      initial={{ pathLength: initialAnimation ? 0 : 1 }}
    />
  );
};

const AnimateSvg = ({
  width = "100%",
  height = "100%",
  viewBox = "0 0 24 24",
  paths,
  path, // Legacy prop for single path
  fill, // new prop
  animationType = 'float',
  hoverAnimation = true,
  initialAnimation = true,
  colorConfig = [
    { color: '#FF0000', timestamp: 0 },
    { color: '#00FF00', timestamp: 2 },
    { color: '#0000FF', timestamp: 4 },
  ],
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const pathData = useMemo(() => {
    if (paths) return paths;
    if (path) return [{ d: path, fill: fill }];
    return [];
  }, [paths, path, fill]);

  return (
    <div
      onMouseEnter={() => hoverAnimation && setIsHovering(true)}
      onMouseLeave={() => hoverAnimation && setIsHovering(false)}
      style={{ width, height, cursor: hoverAnimation ? 'pointer' : 'default' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: '#F2C94C', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#2F80ED', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: '#2F80ED', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#56CCF2', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        {pathData.map((p, index) => (
          <AnimatedPath
            key={index}
            d={p.d}
            stroke={p.stroke || "currentColor"}
            strokeWidth={p.strokeWidth || "0"}
            strokeLinecap={p.strokeLinecap || "round"}
            fill={p.fill || 'none'}
            animationType={animationType}
            colorConfig={colorConfig}
            isHovering={isHovering}
            initialAnimation={initialAnimation}
            delay={index * 0.2}
          />
        ))}
      </svg>
    </div>
  );
};

export default AnimateSvg; 