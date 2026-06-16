/**
 * Displacement reveal shader for the work thumbnail (DESIGN.md §5.4).
 * A fluid GLSL displacement à la Robin Delaporte's `hover-effect`: the active
 * thumbnail texture is warped by a noise displacement map, and the distortion
 * resolves as `uReveal` animates 0→1. Each time the hovered row changes the
 * texture swaps and `uReveal` resets, so the displacement replays per project.
 *
 * Premultiplied-style fade: alpha is scaled by uReveal so the quad fades in over
 * transparent --paper rather than popping.
 */

export const displacementVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const displacementFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform sampler2D uDisp;
  uniform float uReveal;     // 0 = fully displaced + transparent, 1 = settled + opaque
  uniform float uIntensity;  // max UV displacement
  varying vec2 vUv;

  void main() {
    // displacement falls off as the reveal completes
    vec4 disp = texture2D(uDisp, vUv);
    float amount = (1.0 - uReveal) * uIntensity;
    vec2 uv = vec2(
      vUv.x + amount * (disp.r - 0.5),
      vUv.y + amount * (disp.g - 0.5)
    );

    vec4 tex = texture2D(uTexture, uv);
    gl_FragColor = vec4(tex.rgb, tex.a * uReveal);
  }
`;
