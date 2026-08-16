import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LayerItem, BackgroundConfig } from '../types';
import { getBackgroundCssStyle } from '../utils/backgroundRenderer';

interface Canvas3DProps {
  layers: LayerItem[];
  background?: BackgroundConfig;
  aspectRatio: '9:16' | '1:1';
  theme: 'light' | 'dark';
  autoRotate?: boolean;
}

export const Canvas3D: React.FC<Canvas3DProps> = ({
  layers,
  background,
  aspectRatio,
  theme,
  autoRotate = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshesMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const textureCacheRef = useRef<Map<string, { texture: THREE.CanvasTexture; canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }>>(new Map());
  const reqIdRef = useRef<number | null>(null);
  const emptyStageGroupRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js Scene, Camera, Lights, OrbitControls
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 360;
    const height = containerRef.current.clientHeight || 640;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 40, 720);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxDistance = 1500;
    controls.minDistance = 200;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.5;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, theme === 'dark' ? 1.4 : 1.7);
    scene.add(ambientLight);

    // Main Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(250, 400, 450);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.camera.near = 50;
    keyLight.shadow.camera.far = 1200;
    keyLight.shadow.camera.left = -350;
    keyLight.shadow.camera.right = 350;
    keyLight.shadow.camera.top = 350;
    keyLight.shadow.camera.bottom = -350;
    scene.add(keyLight);

    // Fill Light (Cool Blue)
    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.3);
    fillLight.position.set(-350, 100, 300);
    scene.add(fillLight);

    // Rim / Backlight (Warm Golden)
    const rimLight = new THREE.DirectionalLight(0xfef08a, 1.4);
    rimLight.position.set(0, 350, -350);
    scene.add(rimLight);

    // 6. Studio Pedestal / Ground Shadow Receiver
    const groundGroup = new THREE.Group();
    groundGroup.name = 'studio_ground';

    // Circular Base Platform
    const pedestalGeo = new THREE.CylinderGeometry(220, 240, 14, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x181a20 : 0xe2e8f0,
      roughness: 0.4,
      metalness: 0.2,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.set(0, -290, 0);
    pedestalMesh.receiveShadow = true;
    groundGroup.add(pedestalMesh);

    // Accent Ring on Pedestal
    const ringGeo = new THREE.TorusGeometry(222, 2.5, 16, 64);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xfacc15,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, -283, 0);
    groundGroup.add(ringMesh);

    // Shadow Floor
    const shadowGeo = new THREE.PlaneGeometry(800, 800);
    const shadowMat = new THREE.ShadowMaterial({ opacity: theme === 'dark' ? 0.4 : 0.2 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0, -297, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    groundGroup.add(shadowPlane);

    scene.add(groundGroup);

    // 7. Render Animation Loop
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      controls.dispose();
    };
  }, [theme]);

  // Update auto-rotate on controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Texture Generator for SVG, Unicode & Custom Text
  const getOrCreateTexture = (layer: LayerItem): THREE.CanvasTexture => {
    const textSignature = `${layer.textContent}_${layer.fontFamily}_${layer.textColor}_${layer.strokeColor}_${layer.strokeWidth}_${layer.fontSize}`;
    const cacheKey = `${layer.id}_${layer.type}_${layer.content}_${layer.color}_${textSignature}`;
    if (textureCacheRef.current.has(cacheKey)) {
      return textureCacheRef.current.get(cacheKey)!.texture;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    textureCacheRef.current.set(cacheKey, { texture, canvas, ctx });

    if (layer.type === 'text') {
      ctx.clearRect(0, 0, 512, 512);
      ctx.font = `${layer.isBold ? 'bold' : ''} ${layer.isItalic ? 'italic' : ''} 72px ${
        layer.fontFamily || 'Impact, sans-serif'
      }`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const strokeW = (layer.strokeWidth ?? 4) * 2;
      if (strokeW > 0) {
        ctx.strokeStyle = layer.strokeColor || '#000000';
        ctx.lineWidth = strokeW;
        ctx.lineJoin = 'round';
        ctx.strokeText(layer.textContent || layer.content || 'Texto', 256, 256);
      }

      ctx.fillStyle = layer.textColor || '#FFFFFF';
      ctx.fillText(layer.textContent || layer.content || 'Texto', 256, 256);
      texture.needsUpdate = true;
    } else if (layer.type === 'unicode') {
      ctx.clearRect(0, 0, 512, 512);
      ctx.font = '340px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(layer.content, 256, 265);
      texture.needsUpdate = true;
    } else {
      // SVG Content
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="${layer.viewBox || '0 0 300 300'}" width="512" height="512">
          <style>
            * { fill: ${layer.color}; stroke: ${layer.color}; }
            path, circle, ellipse, rect, polygon { fill: ${layer.color}; }
          </style>
          ${layer.content}
        </svg>
      `;

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        ctx.clearRect(0, 0, 512, 512);
        ctx.drawImage(img, 0, 0, 512, 512);
        URL.revokeObjectURL(url);
        texture.needsUpdate = true;
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        ctx.clearRect(0, 0, 512, 512);
        ctx.fillStyle = layer.color;
        ctx.beginPath();
        ctx.arc(256, 256, 180, 0, Math.PI * 2);
        ctx.fill();
        texture.needsUpdate = true;
      };

      img.src = url;
    }

    return texture;
  };

  // Synchronize 3D Meshes with Layers State
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Handle Empty State: Render a 3D Ghost/Placeholder
    if (layers.length === 0) {
      meshesMapRef.current.forEach(meshGroup => {
        scene.remove(meshGroup);
      });
      meshesMapRef.current.clear();

      if (!emptyStageGroupRef.current) {
        const emptyGroup = new THREE.Group();
        emptyGroup.name = 'empty_placeholder';

        const ghostGeo = new THREE.SphereGeometry(120, 32, 32);
        const ghostMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
          roughness: 0.1,
        });
        const ghostMesh = new THREE.Mesh(ghostGeo, ghostMat);
        ghostMesh.position.set(0, 40, 0);
        emptyGroup.add(ghostMesh);

        scene.add(emptyGroup);
        emptyStageGroupRef.current = emptyGroup;
      }
      return;
    }

    if (emptyStageGroupRef.current) {
      scene.remove(emptyStageGroupRef.current);
      emptyStageGroupRef.current = null;
    }

    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);
    const currentLayerIds = new Set(layers.map(l => l.id));

    // Remove deleted layers
    meshesMapRef.current.forEach((meshGroup, id) => {
      if (!currentLayerIds.has(id)) {
        scene.remove(meshGroup);
        meshesMapRef.current.delete(id);
      }
    });

    const centerX = 540;
    const centerY = 960;

    sortedLayers.forEach((layer, index) => {
      let group = meshesMapRef.current.get(layer.id);

      if (!group) {
        group = new THREE.Group();
        group.name = `layer_${layer.id}`;

        const isBase = layer.category === 'bases';
        const depth = layer.depth || (isBase ? 26 : 8);

        if (isBase && layer.geometryType === 'cylinder') {
          const cylinderGeo = new THREE.CylinderGeometry(140, 140, depth, 64);
          cylinderGeo.rotateX(Math.PI / 2);

          const rimGeo = new THREE.CylinderGeometry(150, 150, depth * 0.85, 64);
          rimGeo.rotateX(Math.PI / 2);
          const rimMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(layer.color).multiplyScalar(0.85),
            roughness: 0.35,
            metalness: 0.25,
          });
          const rimMesh = new THREE.Mesh(rimGeo, rimMat);
          rimMesh.position.z = -1.5;
          group.add(rimMesh);

          const faceMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(layer.color),
            roughness: 0.25,
            metalness: 0.1,
          });
          const faceMesh = new THREE.Mesh(cylinderGeo, faceMat);
          faceMesh.castShadow = true;
          faceMesh.receiveShadow = true;
          group.add(faceMesh);
        } else if (isBase && layer.geometryType === 'sphere') {
          const sphereGeo = new THREE.SphereGeometry(145, 48, 48);
          const sphereMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(layer.color),
            roughness: 0.28,
            metalness: 0.15,
          });
          const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
          sphereMesh.scale.z = 0.55;
          sphereMesh.castShadow = true;
          sphereMesh.receiveShadow = true;
          group.add(sphereMesh);
        } else {
          const texture = getOrCreateTexture(layer);

          const plateGeo = new THREE.PlaneGeometry(280, 280);
          const plateMat = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.02,
            roughness: 0.2,
            metalness: 0.05,
            side: THREE.DoubleSide,
          });

          const plateMesh = new THREE.Mesh(plateGeo, plateMat);
          plateMesh.castShadow = true;
          plateMesh.receiveShadow = true;
          group.add(plateMesh);

          const backGeo = new THREE.PlaneGeometry(280, 280);
          const backMat = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.02,
            roughness: 0.4,
            metalness: 0.1,
            side: THREE.DoubleSide,
          });
          const backMesh = new THREE.Mesh(backGeo, backMat);
          backMesh.position.z = -depth;
          group.add(backMesh);
        }

        scene.add(group);
        meshesMapRef.current.set(layer.id, group);
      }

      if (layer.category === 'bases') {
        group.traverse(child => {
          if (child instanceof THREE.Mesh && child.material && 'color' in child.material) {
            (child.material as THREE.MeshStandardMaterial).color.set(layer.color);
          }
        });
      }

      const posX = (layer.x - centerX) * 0.62;
      const posY = -(layer.y - centerY) * 0.62;
      const posZ = index * 10 + (layer.z || 0);

      group.position.set(posX, posY, posZ);
      group.rotation.z = (-layer.rotation * Math.PI) / 180;
      group.scale.set(layer.scaleX, layer.scaleY, 1);

      group.traverse(child => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.opacity = layer.opacity;
          mat.transparent = layer.opacity < 1 || mat.transparent;
        }
      });
    });
  }, [layers, aspectRatio]);

  return (
    <div
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing overflow-hidden transition-all duration-300"
      style={getBackgroundCssStyle(background)}
    >
      <div ref={containerRef} className="w-full h-full" />

      {/* 3D Control Hints Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1.5 z-10">
        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-400 text-zinc-950 shadow-md backdrop-blur-md w-fit flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Lulu 3D Studio Live
        </span>
        <span className="text-[10px] text-zinc-300 bg-zinc-900/80 border border-zinc-700/60 px-2.5 py-1 rounded-lg backdrop-blur-md w-fit">
          Órbita 360° • Zoom con Rueda/Pellizco • Iluminación en tiempo real
        </span>
      </div>

      {/* Empty State Overlay in 3D */}
      {layers.length === 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-center p-6 rounded-3xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md max-w-xs mx-4">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-3 font-bold text-xl border border-amber-400/30">
              ✨
            </div>
            <h4 className="text-sm font-bold text-zinc-100 mb-1">Estudio 3D Listo</h4>
            <p className="text-xs text-zinc-400">
              Agrega una base, texto o piezas desde la barra inferior para verlas transformarse en figuras 3D coleccionables.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
