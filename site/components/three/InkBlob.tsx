'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders/blob.glsl';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * InkBlob (DESIGN.md §5.1 / Phase 1): the cursor-reactive cobalt ink blob — the
 * site's one signature. A transparent R3F canvas with a single full-quad plane
 * running the blob shader.
 *
 * It is strictly decorative: the real hero <h1> is the LCP, so this is mounted
 * client-only (dynamic import, ssr: false) and never blocks first paint. The
 * frameloop is paused when the canvas scrolls offscreen (IntersectionObserver),
 * dpr is capped at 1.5, and under reduced motion the WebGL is dropped for a
 * static cobalt wash.
 */

type Pointer = { x: number; y: number; hover: number };

function Blob({ pointer }: { pointer: React.MutableRefObject<Pointer> }) {
  const { viewport, size } = useThree();

  // Stable uniforms object (created once).
  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uHover: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  });

  useEffect(() => {
    uniforms.current.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height]);

  useFrame((_, delta) => {
    const u = uniforms.current;
    const p = pointer.current;
    // clamp delta so a backgrounded tab doesn't jump the animation on resume
    u.uTime.value += Math.min(delta, 0.05);
    u.uMouse.value.x += (p.x - u.uMouse.value.x) * 0.08;
    u.uMouse.value.y += (p.y - u.uMouse.value.y) * 0.08;
    u.uHover.value += (p.hover - u.uHover.value) * 0.06;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

type Props = {
  /** dims the blob for the closing CTA reuse (DESIGN.md §8 — lower intensity) */
  className?: string;
};

export default function InkBlob({ className = '' }: Props) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, hover: 0 });
  const [active, setActive] = useState(false);

  // Pause the RAF when the canvas is offscreen (perf §6).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Track the pointer in the blob's centered/normalized space. The attractor in
  // the shader falls off with distance, so mapping the global pointer is fine —
  // the blob simply leans toward the cursor wherever it is over the hero.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      pointer.current.x = (e.clientX - r.left) / r.width - 0.5;
      pointer.current.y = 1 - (e.clientY - r.top) / r.height - 0.5;
      pointer.current.hover = 1;
    };
    const onLeave = () => {
      pointer.current.hover = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Reduced motion: no WebGL, no RAF — a calm static cobalt wash (§7).
  if (reduced) {
    return (
      <div
        ref={containerRef}
        aria-hidden
        className={`h-full w-full ${className}`}
        style={{
          background:
            'radial-gradient(closest-side, rgba(27,60,255,0.16), rgba(232,236,255,0.10) 55%, transparent 76%)',
        }}
      />
    );
  }

  return (
    <div ref={containerRef} aria-hidden className={`h-full w-full ${className}`}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Blob pointer={pointer} />
      </Canvas>
    </div>
  );
}
