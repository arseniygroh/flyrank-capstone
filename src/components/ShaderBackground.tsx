"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float wave = sin(st.x * 5.0 + u_time * 0.5) * 0.5;
    
    float mouseDist = distance(st, u_mouse);
    float mouseEffect = smoothstep(0.6, 0.0, mouseDist) * 0.3;
    
    vec3 color1 = vec3(0.05, 0.0, 0.15); // Deep Dark Purple
    vec3 color2 = vec3(0.0, 0.3, 0.3);   // Moody Teal
    vec3 color3 = vec3(0.3, 0.0, 0.15);  // Dark Magenta
    
    float mix1 = sin(st.y * 3.0 + u_time * 0.3 + wave) * 0.5 + 0.5;
    vec3 finalColor = mix(color1, color2, mix1);
    
    float mix2 = cos(st.x * 2.0 - u_time * 0.2 + mouseEffect) * 0.5 + 0.5;
    finalColor = mix(finalColor, color3, mix2);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function ShaderMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) }, 
    }),
    [size]
  );

  useFrame((state) => {
    if (materialRef.current && !document.hidden) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (materialRef.current) {
        const x = e.clientX / window.innerWidth;
        const y = 1.0 - (e.clientY / window.innerHeight);
        materialRef.current.uniforms.u_mouse.value.set(x, y);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-neutral-950 via-purple-950/20 to-teal-950/20" />
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas dpr={[1, 2]} gl={{ antialias: false }}>
        <ShaderMesh />
      </Canvas>
    </div>
  );
}