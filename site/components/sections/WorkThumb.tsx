'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  displacementVertexShader,
  displacementFragmentShader,
} from '@/components/three/shaders/displacement.glsl';

/**
 * WorkThumb (DESIGN.md §5.4 / Phase 3): the floating work thumbnail rendered
 * with a fluid GLSL displacement. A single fixed-size R3F quad shows the hovered
 * project's thumbnail; whenever `activeIndex` changes the texture swaps and the
 * displacement reveal replays. Positioning + cursor-tracking + fade are owned by
 * the parent <Work> (this is just the canvas). Mounted only when WebGL is
 * available and motion is allowed; otherwise <Work> renders a static <img>
 * crossfade instead.
 */

const THUMB_W = 640;
const THUMB_H = 480;

/** Smooth, low-frequency displacement map built once (no asset, no random). */
function makeDispTexture(): THREE.DataTexture {
  const S = 64;
  const data = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const u = x / S;
      const v = y / S;
      const r = 0.5 + 0.5 * Math.sin(u * Math.PI * 3.0) * Math.cos(v * Math.PI * 2.0);
      const g = 0.5 + 0.5 * Math.sin((u + v) * Math.PI * 2.5 + 1.7);
      const i = (y * S + x) * 4;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/** Rasterize each (SVG) thumbnail to a CanvasTexture — reliable across browsers. */
function useThumbTextures(urls: readonly string[]): (THREE.CanvasTexture | null)[] | null {
  const [textures, setTextures] = useState<(THREE.CanvasTexture | null)[] | null>(null);

  // urls come from static content; join() gives a stable dep key.
  const key = urls.join('|');

  useEffect(() => {
    let alive = true;
    Promise.all(
      urls.map(
        (url) =>
          new Promise<THREE.CanvasTexture | null>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = THUMB_W;
              canvas.height = THUMB_H;
              const ctx = canvas.getContext('2d');
              if (!ctx) return resolve(null);
              ctx.drawImage(img, 0, 0, THUMB_W, THUMB_H);
              const tex = new THREE.CanvasTexture(canvas);
              tex.minFilter = THREE.LinearFilter;
              tex.magFilter = THREE.LinearFilter;
              resolve(tex);
            };
            img.onerror = () => resolve(null);
            img.src = url;
          }),
      ),
    ).then((list) => {
      if (alive) setTextures(list);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return textures;
}

function Quad({
  textures,
  dispTex,
  activeIndex,
}: {
  textures: (THREE.CanvasTexture | null)[] | null;
  dispTex: THREE.DataTexture;
  activeIndex: number;
}) {
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as THREE.Texture | null },
      uDisp: { value: dispTex },
      uReveal: { value: 0 },
      uIntensity: { value: 0.4 },
    }),
    [dispTex],
  );

  // Swap texture + replay the displacement reveal whenever the hovered row changes.
  const lastIndex = useRef(-1);
  useEffect(() => {
    if (!textures || activeIndex < 0) return;
    const tex = textures[activeIndex % textures.length];
    if (tex) uniforms.uTexture.value = tex;
    if (activeIndex !== lastIndex.current) {
      uniforms.uReveal.value = 0; // restart the warp
      lastIndex.current = activeIndex;
    }
  }, [activeIndex, textures, uniforms]);

  useFrame((_, delta) => {
    if (uniforms.uTexture.value) {
      // ease the displacement out as the thumbnail settles
      uniforms.uReveal.value += (1 - uniforms.uReveal.value) * Math.min(delta * 5, 0.25);
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={displacementVertexShader}
        fragmentShader={displacementFragmentShader}
      />
    </mesh>
  );
}

export default function WorkThumb({
  thumbnails,
  activeIndex,
}: {
  thumbnails: readonly string[];
  activeIndex: number;
}) {
  const textures = useThumbTextures(thumbnails);
  const dispTex = useMemo(() => makeDispTexture(), []);

  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 1], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <Quad textures={textures} dispTex={dispTex} activeIndex={activeIndex} />
    </Canvas>
  );
}
