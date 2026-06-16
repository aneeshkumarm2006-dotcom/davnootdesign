/**
 * blob.glsl.ts — GLSL for the signature cobalt ink blob (DESIGN.md §5.1 / Phase 1).
 *
 * A full-quad plane whose fragment shader builds a soft metaball from
 * domain-warped fbm value-noise, color-ramped between --cobalt and
 * --cobalt-soft, output with alpha over the transparent canvas (the --paper
 * page shows through). The pointer adds a radial attractor that displaces the
 * noise field toward the cursor (uHover gates the strength so the blob is calm
 * until the pointer engages).
 *
 * Colors are hardcoded as sRGB 0–1 to match the tokens exactly: a raw
 * ShaderMaterial writes gl_FragColor straight to the framebuffer (no automatic
 * color-space conversion), so design hexes map 1:1.
 */

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uMouse;      // pointer in centered, aspect-corrected space
  uniform vec2  uResolution; // canvas pixel size (for aspect)
  uniform float uHover;      // 0 → 1, smoothed pointer engagement

  // ── value noise + fbm ───────────────────────────────────────────
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.02 + vec2(11.3, 7.7);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vUv - 0.5;  p.x *= aspect;
    vec2 m = uMouse;     m.x *= aspect;

    float t = uTime * 0.12;

    // domain warp — the slow organic drift
    vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 + vec2(3.1, 1.7) - t));
    vec2 warp = p + 0.45 * (q - 0.5);

    // radial attractor: pull the field toward the pointer, falling off with distance
    vec2 toM = m - p;
    float md = length(toM);
    warp += toM * (0.25 * uHover) * exp(-md * 1.8);

    // organic ink spread across the whole field (not a centered metaball)
    float n = fbm(warp * 1.8 + t * 1.3);
    float field = smoothstep(0.22, 0.72, n);
    // fade only at the outer borders so the ink melts into the paper
    vec2 fade = smoothstep(0.0, 0.16, vUv) * smoothstep(1.0, 0.84, vUv);
    float blob = clamp(field * fade.x * fade.y, 0.0, 1.0);

    // color ramp: --cobalt body → --cobalt-soft highlight
    vec3 cobalt = vec3(0.106, 0.235, 1.0);
    vec3 soft   = vec3(0.910, 0.925, 1.0);
    vec3 col = mix(cobalt, soft, smoothstep(0.25, 0.95, n));

    // brighten subtly toward the pointer
    col = mix(col, soft, uHover * exp(-md * 2.5) * 0.5);

    float alpha = smoothstep(0.04, 0.45, blob) * 0.9;
    gl_FragColor = vec4(col, alpha);
  }
`;
