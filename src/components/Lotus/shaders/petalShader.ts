import * as THREE from 'three';

// 🎨 Custom Shader 材質 - 實現漸變與 Fresnel 邊緣光
export const PetalShaderMaterial = {
    uniforms: {
        uColorInner: { value: new THREE.Color('#C24A8F') },
        uColorOuter: { value: new THREE.Color('#FFB6D9') },
        uTime: { value: 0 },
        uGlowIntensity: { value: 0.3 },
        uOpacity: { value: 0.9 }
    },
    vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 uColorInner;
    uniform vec3 uColorOuter;
    uniform float uTime;
    uniform float uGlowIntensity;
    uniform float uOpacity;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // 從花心到邊緣的漸變
      float gradient = smoothstep(0.0, 1.0, vUv.y);
      vec3 baseColor = mix(uColorInner, uColorOuter, gradient);
      
      // Fresnel 邊緣光效果 - 降低強度讓光芒更柔和
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 4.0);
      vec3 fresnelColor = vec3(1.0, 0.95, 0.9) * fresnel * 0.15;
      
      // 呼吸光暈 - 降低振幅
      float breath = sin(uTime * 1.5) * 0.05 + 0.95;
      vec3 glow = baseColor * uGlowIntensity * 0.5 * breath;
      
      // 組合最終顏色
      vec3 finalColor = baseColor + fresnelColor + glow;
      
      gl_FragColor = vec4(finalColor, uOpacity + fresnel * 0.1);
    }
  `,
    transparent: true,
    side: THREE.DoubleSide
};
