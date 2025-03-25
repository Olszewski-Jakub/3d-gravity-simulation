'use client';

import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const OrbitalPath = ({ points, color = '#FFFFFF' }) => {
  // No need to render if we don't have at least 2 points
  if (!points || points.length < 2) return null;

  // Create line points from orbital path
  const linePoints = useMemo(() => {
    return points.map(point => [...point]);
  }, [points]);

  // Create colors array for fading effect
  const colors = useMemo(() => {
    return points.map((_, index, array) => {
      // Calculate opacity based on position in the path (newer points are more opaque)
      const opacity = Math.min(0.8, index / array.length + 0.1);
      // THREE.Color doesn't accept rgba, so we use the color's RGB with varying intensity
      return new THREE.Color(color).multiplyScalar(opacity);
    });
  }, [points, color]);

  return (
      <Line
          points={linePoints}
          color={color}
          vertexColors={colors}
          lineWidth={1}
          opacity={0.8}
          transparent
          dashed={false}
      />
  );
};

export default OrbitalPath;