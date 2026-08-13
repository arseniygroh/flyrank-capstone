"use client";

import React, { JSX } from 'react';
import { useGLTF, Float } from '@react-three/drei';

interface CassetteProps {
  tapeColor?: string;
  isPlaying?: boolean;
  scale?: number;
}

export function CassetteModel({
  tapeColor = "#ff007f",
  isPlaying = false,
  scale = 0.014,
  ...props
}: CassetteProps & JSX.IntrinsicElements['group']) {

  const { nodes, materials } = useGLTF('/cassette.glb') as any;

  return (
    <Float
      speed={isPlaying ? 3 : 0}
      rotationIntensity={isPlaying ? 0.2 : 0}
      floatIntensity={isPlaying ? 0.5 : 0}
    >
      <group {...props} dispose={null}>

        <mesh
          geometry={nodes.cube_Casepng_0.geometry}
          material={materials['Case.png']}
          material-color={tapeColor}
          rotation={[0, 0, -1.571]}
          scale={scale}
        />

        <mesh
          geometry={nodes.plane_Face_1png_0.geometry}
          material={materials['Face_1.png']}
          position={[0.009, 0, 0]}
          rotation={[0, 0, -1.571]}
          scale={scale}
        />

        <mesh
          geometry={nodes.cube_1_Bandpng_0.geometry}
          material={materials['Band.png']}
          rotation={[0, 0, -1.571]}
          scale={scale}
        />

      </group>
    </Float>
  );
}

useGLTF.preload('/cassette.glb');
