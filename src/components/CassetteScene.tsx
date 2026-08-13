"use client";

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { CassetteModel } from './CassetteModel';

interface CassetteSceneProps {
  isPlaying: boolean;
}

interface CameraConfig {
  position: [number, number, number];
  fov: number;
  modelScale: number;
}

function getCameraConfig(width: number): CameraConfig {
  if (width < 380) {
    return { position: [0, 0, 1.55], fov: 52, modelScale: 0.013 };
  }
  if (width < 640) {
    return { position: [0, 0, 1.38], fov: 48, modelScale: 0.014 };
  }
  return { position: [0, 0, 1.2], fov: 45, modelScale: 0.014 };
}

export default function CassetteScene({ isPlaying }: CassetteSceneProps) {
  const [tapeColor, setTapeColor] = useState('#ff007f');
  const [cameraConfig, setCameraConfig] = useState<CameraConfig>(() =>
    typeof window !== 'undefined'
      ? getCameraConfig(window.innerWidth)
      : { position: [0, 0, 1.2], fov: 45, modelScale: 0.014 }
  );

  useEffect(() => {
    function handleResize() {
      setCameraConfig(getCameraConfig(window.innerWidth));
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors = [
    { name: 'Neon Pink', hex: '#ff007f' },
    { name: 'Clear Blue', hex: '#00ccff' },
    { name: 'Pumpkin Orange', hex: '#FF7518' },
    { name: 'Classic White', hex: '#eeeeee' },
  ];

  return (
    <section
      aria-label="Interactive cassette preview"
      className="w-full max-w-md mx-auto flex flex-col items-center gap-4 sm:gap-6 my-4 sm:my-8 px-4 sm:px-0"
    >
      <p className="text-xs text-neutral-500 text-center sm:hidden">
        Drag to rotate the cassette
      </p>

      <div className="w-full aspect-square max-h-[min(72vw,320px)] sm:max-h-none sm:aspect-[4/3] md:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-grab active:cursor-grabbing relative touch-none">
        <Canvas
          camera={{ position: cameraConfig.position, fov: cameraConfig.fov }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />

          <CassetteModel
            isPlaying={isPlaying}
            tapeColor={tapeColor}
            scale={cameraConfig.modelScale}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            rotateSpeed={0.8}
            touches={{ ONE: 0, TWO: 0 }}
          />

          <ContactShadows position={[0, -0.6, 0]} opacity={0.5} scale={10} blur={2} far={2} />
        </Canvas>
      </div>

      <div
        role="group"
        aria-label="Tape color"
        className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-neutral-900/50 px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full border border-neutral-800 w-full sm:w-auto"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 shrink-0">
          Tape color
        </span>
        <div className="flex gap-3 sm:gap-3 justify-center">
          {colors.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setTapeColor(c.hex)}
              className={`w-11 h-11 sm:w-8 sm:h-8 rounded-full border-2 transition-transform active:scale-95 sm:hover:scale-110 ${
                tapeColor === c.hex ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
              aria-label={`Change color to ${c.name}`}
              aria-pressed={tapeColor === c.hex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
