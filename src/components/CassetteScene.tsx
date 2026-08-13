"use client";

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { CassetteModel } from './CassetteModel';

interface CassetteSceneProps {
  isPlaying: boolean;
}

export default function CassetteScene({ isPlaying }: CassetteSceneProps) {
  const [tapeColor, setTapeColor] = useState('#ff007f');

  const colors = [
    {
        name: 'Neon Pink', 
        hex: '#ff007f' 
    },
    {
        name: 'Clear Blue', 
        hex: '#00ccff' 
    },
    { 
        name: 'Pumpkin Orange', 
        hex: '#FF7518' 
    },
    { 
        name: 'Classic White', 
        hex: '#eeeeee' 
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 my-8">
      <div className="w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-grab active:cursor-grabbing relative">
        <Canvas camera={{ position: [0, 0, 1.2], fov: 45 }}>
          
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          
          <CassetteModel 
            isPlaying={isPlaying} 
            tapeColor={tapeColor} 
          />

          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />

          <ContactShadows position={[0, -0.6, 0]} opacity={0.5} scale={10} blur={2} far={2} />
        </Canvas>
      </div>

      <div className="flex items-center gap-4 bg-neutral-900/50 px-6 py-3 rounded-full border border-neutral-800">
        <div className="flex gap-3">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => setTapeColor(c.hex)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                tapeColor === c.hex ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
              aria-label={`Change color to ${c.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}