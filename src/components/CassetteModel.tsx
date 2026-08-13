"use client";

import React, { JSX, useRef } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CassetteProps {
  tapeColor?: string;
  playlistName?: string;
  isPlaying?: boolean;
}

export function CassetteModel({ 
  tapeColor = "#ff007f", 
  playlistName = "MIX TAPE",
  isPlaying = false,
  ...props 
}: CassetteProps & JSX.IntrinsicElements['group']) {
  
  
  const { nodes, materials } = useGLTF('/cassette.glb') as any;

  const leftSpoolRef = useRef<THREE.Mesh>(null!);
  const rightSpoolRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (isPlaying) {
      leftSpoolRef.current.rotation.x += delta * 2;
      rightSpoolRef.current.rotation.x += delta * 2;
    }
  });

  return (
    <group {...props} dispose={null}>
      
      <mesh 
        geometry={nodes.cube_Casepng_0.geometry} 
        material={materials['Case.png']} 
        material-color={tapeColor}
        rotation={[0, 0, -1.571]} 
        scale={0.014} 
      />
    
      <group position={[0.009, 0, 0]} rotation={[0, 0, -1.571]} scale={0.014}>
        <mesh 
          ref={leftSpoolRef}
          geometry={nodes['cylinder_Cylinder_1_(small)png_0'].geometry} 
          material={materials['Cylinder_1_small.png']} 
        />
      </group>

      <mesh 
        geometry={nodes.plane_Face_1png_0.geometry} 
        material={materials['Face_1.png']} 
        position={[0.009, 0, 0]} 
        rotation={[0, 0, -1.571]} 
        scale={0.014} 
      />

      <Text
        position={[0, 0.1, 0.5]} 
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
      >
        {playlistName}
      </Text>

      <mesh 
        geometry={nodes.cube_1_Bandpng_0.geometry} 
        material={materials['Band.png']} 
        rotation={[0, 0, -1.571]} 
        scale={0.014} 
      />
      
      <group position={[0.009, 0, 0]} rotation={[0, 0, -1.571]} scale={0.014}>
        <mesh 
          ref={rightSpoolRef}
          geometry={nodes['cylinder_1_Cylinder_2_(big)png_0'].geometry} 
          material={materials['Cylinder_2_big.png']} 
        />
      </group>

    </group>
  );
}

useGLTF.preload('/cassette.glb');