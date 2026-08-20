import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { LayerItem, BackgroundConfig } from '../types';
import { getBackgroundCssStyle } from '../utils/backgroundRenderer';

interface Canvas3DProps {
  layers: LayerItem[];
  background?: BackgroundConfig;
  aspectRatio: '9:16' | '1:1';
  theme: 'light' | 'dark';
  autoRotate?: boolean;
}

export type MaterialStyle3D = 'toy' | 'metallic' | 'glossy' | 'matte';

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
  const meshesMapRef = useRef<Map<string, { group: THREE.Group; signature: string }>>(new Map());
  const textureCacheRef = useRef<Map<string, THREE.CanvasTexture>>(new Map());
  const reqIdRef = useRef<number | null>(null);
  const emptyStageGroupRef = useRef<THREE.Group | null>(null);

  const [materialStyle, setMaterialStyle] = useState<MaterialStyle3D>('toy');
  const [internalAutoRotate, setInternalAutoRotate] = useState(autoRotate);

  // Sync internal auto rotate with prop
  useEffect(() => {
    setInternalAutoRotate(autoRotate);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update controls when internal auto rotate changes
  const toggleAutoRotate = () => {
    const next = !internalAutoRotate;
    setInternalAutoRotate(next);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = next;
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 30, 720);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (delta: number) => {
    if (cameraRef.current && controlsRef.current) {
      const zoomFactor = delta > 0 ? 0.85 : 1.18;
      cameraRef.current.position.multiplyScalar(zoomFactor);
      controlsRef.current.update();
    }
  };

  // 1. Initialize Scene, Camera, Studio Lighting, OrbitControls
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 360;
    const height = containerRef.current.clientHeight || 640;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2500);
    camera.position.set(0, 30, 720);
    cameraRef.current = camera;

    // WebGL Renderer optimized for mobile Android (high performance, antialias, shadow map)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    // Limit pixel ratio to 2 to prevent GPU lag on high-DPI Android phones
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls tuned for Android mobile touch screens
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 1600;
    controls.minDistance = 180;
    controls.autoRotate = internalAutoRotate;
    controls.autoRotateSpeed = 2.4;
    controls.target.set(0, 0, 0);
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };
    controlsRef.current = controls;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, theme === 'dark' ? 1.5 : 1.8);
    ambientLight.name = 'ambient_light';
    scene.add(ambientLight);

    // Key Light (Main Sun)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(240, 420, 450);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.camera.near = 50;
    keyLight.shadow.camera.far = 1400;
    keyLight.shadow.camera.left = -380;
    keyLight.shadow.camera.right = 380;
    keyLight.shadow.camera.top = 380;
    keyLight.shadow.camera.bottom = -380;
    scene.add(keyLight);

    // Fill Light (Cool Sky)
    const fillLight = new THREE.DirectionalLight(0x7dd3fc, 1.2);
    fillLight.position.set(-350, 150, 300);
    scene.add(fillLight);

    // Rim / Backlight (Warm Golden)
    const rimLight = new THREE.DirectionalLight(0xfef08a, 1.4);
    rimLight.position.set(0, 350, -400);
    scene.add(rimLight);

    // 3D Studio Pedestal Platform
    const groundGroup = new THREE.Group();
    groundGroup.name = 'studio_ground';

    // Pedestal Cylinder
    const pedestalGeo = new THREE.CylinderGeometry(230, 250, 16, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x1a1d24 : 0xe2e8f0,
      roughness: 0.35,
      metalness: 0.2,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.set(0, -290, 0);
    pedestalMesh.receiveShadow = true;
    groundGroup.add(pedestalMesh);

    // Glowing Golden Ring around Pedestal
    const ringGeo = new THREE.TorusGeometry(232, 3, 16, 64);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xfacc15,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, -282, 0);
    groundGroup.add(ringMesh);

    // Soft Shadow Floor
    const shadowGeo = new THREE.PlaneGeometry(900, 900);
    const shadowMat = new THREE.ShadowMaterial({ opacity: theme === 'dark' ? 0.45 : 0.25 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.position.set(0, -298, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    groundGroup.add(shadowPlane);

    scene.add(groundGroup);

    // Animation Render Loop
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // Responsive Resize Observer
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

  // Helper to generate Material properties based on selected 3D style
  const getMaterialParams = (baseColor: THREE.ColorRepresentation, isRim = false) => {
    const color = new THREE.Color(baseColor);
    switch (materialStyle) {
      case 'metallic':
        return {
          color,
          roughness: 0.18,
          metalness: 0.85,
        };
      case 'glossy':
        return {
          color,
          roughness: 0.1,
          metalness: 0.15,
        };
      case 'matte':
        return {
          color,
          roughness: 0.65,
          metalness: 0.05,
        };
      case 'toy':
      default:
        return {
          color,
          roughness: isRim ? 0.25 : 0.28,
          metalness: isRim ? 0.4 : 0.12,
        };
    }
  };

  // Helper to create high-resolution Canvas Textures for Text, SVG, and Unicode
  const generateTexture = (layer: LayerItem): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    if (layer.type === 'text') {
      // 3D Custom Text rendering
      ctx.clearRect(0, 0, 1024, 1024);

      const fontSize = Math.min(180, (layer.fontSize || 72) * 2.2);
      ctx.font = `${layer.isBold ? 'bold' : 'normal'} ${layer.isItalic ? 'italic' : 'normal'} ${fontSize}px ${
        layer.fontFamily || 'Impact, sans-serif'
      }`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const strokeW = (layer.strokeWidth ?? 6) * 3;
      const textToRender = layer.textContent || layer.content || 'Texto 3D';

      // Drop shadow for 3D depth
      if (layer.hasShadow !== false) {
        ctx.shadowColor = 'rgba(0,0,0,0.65)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 10;
      }

      // Outer Stroke
      if (strokeW > 0) {
        ctx.strokeStyle = layer.strokeColor || '#000000';
        ctx.lineWidth = strokeW;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeText(textToRender, 512, 512);
      }

      ctx.shadowColor = 'transparent';

      // Text Fill (Supports bright colors or gradients)
      ctx.fillStyle = layer.textColor || '#FFFFFF';
      ctx.fillText(textToRender, 512, 512);

      texture.needsUpdate = true;
    } else if (layer.type === 'unicode') {
      // 3D Unicode Emoji rendering
      ctx.clearRect(0, 0, 1024, 1024);
      ctx.font = '680px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(layer.content, 512, 530);
      texture.needsUpdate = true;
    } else {
      // 3D SVG Shape / Piece rendering
      let svgContent = layer.content;
      const activeColor = layer.color || '#FACC15';

      // Comprehensive replacement of currentColor
      svgContent = svgContent.replace(/fill="currentColor"/gi, `fill="${activeColor}"`);
      svgContent = svgContent.replace(/stroke="currentColor"/gi, `stroke="${activeColor}"`);
      svgContent = svgContent.replace(/fill='currentColor'/gi, `fill='${activeColor}'`);
      svgContent = svgContent.replace(/stroke='currentColor'/gi, `stroke='${activeColor}'`);

      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="${layer.viewBox || '0 0 300 300'}" width="1024" height="1024" style="color: ${activeColor}">
          <defs>
            <style>
              * { color: ${activeColor}; }
              .colored { fill: ${activeColor}; stroke: ${activeColor}; }
            </style>
          </defs>
          <g fill="${activeColor}" color="${activeColor}">
            ${svgContent}
          </g>
        </svg>
      `;

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        ctx.clearRect(0, 0, 1024, 1024);
        ctx.drawImage(img, 0, 0, 1024, 1024);
        URL.revokeObjectURL(url);
        texture.needsUpdate = true;
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        ctx.clearRect(0, 0, 1024, 1024);
        ctx.fillStyle = activeColor;
        ctx.beginPath();
        ctx.arc(512, 512, 380, 0, Math.PI * 2);
        ctx.fill();
        texture.needsUpdate = true;
      };

      img.src = url;
    }

    return texture;
  };

  // Synchronize 3D Meshes & Geometry with Application Layers State
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Handle Empty State: Render a 3D Glowing Ghost Placeholder
    if (layers.length === 0) {
      meshesMapRef.current.forEach(({ group }) => {
        scene.remove(group);
      });
      meshesMapRef.current.clear();

      if (!emptyStageGroupRef.current) {
        const emptyGroup = new THREE.Group();
        emptyGroup.name = 'empty_placeholder';

        const ghostGeo = new THREE.SphereGeometry(130, 32, 32);
        const ghostMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
          roughness: 0.1,
        });
        const ghostMesh = new THREE.Mesh(ghostGeo, ghostMat);
        ghostMesh.position.set(0, 30, 0);
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

    // Remove deleted layers from 3D scene
    meshesMapRef.current.forEach(({ group }, id) => {
      if (!currentLayerIds.has(id)) {
        scene.remove(group);
        // Dispose geometries and materials
        group.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });
        meshesMapRef.current.delete(id);
      }
    });

    const centerX = 540;
    const centerY = aspectRatio === '9:16' ? 960 : 540;

    sortedLayers.forEach((layer, index) => {
      const isBase = layer.category === 'bases';
      const isText = layer.type === 'text';
      const depth = layer.depth || (isBase ? 28 : isText ? 18 : 12);

      // Unique signature to detect property changes
      const signature = `${layer.id}_${layer.type}_${layer.content}_${layer.color}_${layer.textContent}_${layer.fontFamily}_${layer.textColor}_${layer.strokeColor}_${layer.strokeWidth}_${layer.fontSize}_${layer.isBold}_${layer.isItalic}_${depth}_${layer.geometryType}_${materialStyle}`;

      let meshEntry = meshesMapRef.current.get(layer.id);

      // If mesh doesn't exist or its signature changed, build fresh 3D geometry
      if (!meshEntry || meshEntry.signature !== signature) {
        if (meshEntry) {
          scene.remove(meshEntry.group);
          meshEntry.group.traverse(child => {
            if (child instanceof THREE.Mesh) {
              child.geometry?.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else if (child.material) {
                child.material.dispose();
              }
            }
          });
        }

        const group = new THREE.Group();
        group.name = `layer_${layer.id}`;

        // 1. BASE GEOMETRIES
        if (isBase && layer.geometryType === 'cylinder') {
          // 3D Beveled Coin/Head
          const cylinderGeo = new THREE.CylinderGeometry(140, 140, depth, 64);
          cylinderGeo.rotateX(Math.PI / 2);

          // Outer Beveled Rim
          const rimGeo = new THREE.CylinderGeometry(148, 148, depth * 0.88, 64);
          rimGeo.rotateX(Math.PI / 2);
          const rimMat = new THREE.MeshStandardMaterial(
            getMaterialParams(new THREE.Color(layer.color).multiplyScalar(0.8), true)
          );
          const rimMesh = new THREE.Mesh(rimGeo, rimMat);
          rimMesh.position.z = -1;
          group.add(rimMesh);

          // Face Mesh
          const faceMat = new THREE.MeshStandardMaterial(getMaterialParams(layer.color));
          const faceMesh = new THREE.Mesh(cylinderGeo, faceMat);
          faceMesh.castShadow = true;
          faceMesh.receiveShadow = true;
          group.add(faceMesh);
        } else if (isBase && layer.geometryType === 'sphere') {
          // 3D Smooth Sphere Head
          const sphereGeo = new THREE.SphereGeometry(145, 48, 48);
          const sphereMat = new THREE.MeshStandardMaterial(getMaterialParams(layer.color));
          const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
          sphereMesh.scale.z = 0.58;
          sphereMesh.castShadow = true;
          sphereMesh.receiveShadow = true;
          group.add(sphereMesh);
        } else if (isText) {
          // 2. TRUE 3D TEXT TOKEN & PLAQUE
          const texture = generateTexture(layer);

          // Front Text Face
          const textFrontGeo = new THREE.PlaneGeometry(320, 320);
          const textFrontMat = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.02,
            roughness: 0.15,
            metalness: materialStyle === 'metallic' ? 0.8 : 0.1,
            side: THREE.DoubleSide,
          });
          const textFrontMesh = new THREE.Mesh(textFrontGeo, textFrontMat);
          textFrontMesh.position.z = depth / 2;
          textFrontMesh.castShadow = true;
          group.add(textFrontMesh);

          // 3D Back Plaque with Bevel
          const textBackGeo = new THREE.PlaneGeometry(320, 320);
          const textBackMat = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.02,
            roughness: 0.35,
            metalness: 0.2,
            side: THREE.DoubleSide,
          });
          const textBackMesh = new THREE.Mesh(textBackGeo, textBackMat);
          textBackMesh.position.z = -depth / 2;
          textBackMesh.castShadow = true;
          group.add(textBackMesh);

          // 3D Side Rim Slab (Extrusion depth)
          const textBlockGeo = new THREE.CylinderGeometry(140, 140, depth * 0.9, 32);
          textBlockGeo.rotateX(Math.PI / 2);
          const textBlockMat = new THREE.MeshStandardMaterial(
            getMaterialParams(layer.strokeColor || '#EAB308', true)
          );
          const textBlockMesh = new THREE.Mesh(textBlockGeo, textBlockMat);
          textBlockMesh.position.z = 0;
          textBlockMesh.scale.set(1.1, 0.4, 1);
          textBlockMesh.castShadow = true;
          group.add(textBlockMesh);
        } else {
          // 3. 3D SHAPES, EYES, MOUTHS, ACCESSORIES, UNICODE
          const texture = generateTexture(layer);

          // Front Face
          const frontGeo = new THREE.PlaneGeometry(280, 280);
          const frontMat = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.02,
            roughness: 0.2,
            metalness: materialStyle === 'metallic' ? 0.75 : 0.1,
            side: THREE.DoubleSide,
          });
          const frontMesh = new THREE.Mesh(frontGeo, frontMat);
          frontMesh.position.z = depth / 2;
          frontMesh.castShadow = true;
          frontMesh.receiveShadow = true;
          group.add(frontMesh);

          // Back Face
          const backGeo = new THREE.PlaneGeometry(280, 280);
          const backMat = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.02,
            roughness: 0.35,
            metalness: 0.15,
            side: THREE.DoubleSide,
          });
          const backMesh = new THREE.Mesh(backGeo, backMat);
          backMesh.position.z = -depth / 2;
          backMesh.castShadow = true;
          group.add(backMesh);

          // 3D Side Rim Cylinder for Volumetric Body
          const rimGeo = new THREE.CylinderGeometry(110, 110, depth * 0.85, 32);
          rimGeo.rotateX(Math.PI / 2);
          const rimMat = new THREE.MeshStandardMaterial(
            getMaterialParams(layer.color || '#FACC15', true)
          );
          const rimMesh = new THREE.Mesh(rimGeo, rimMat);
          rimMesh.position.z = 0;
          rimMesh.castShadow = true;
          group.add(rimMesh);
        }

        scene.add(group);
        meshEntry = { group, signature };
        meshesMapRef.current.set(layer.id, meshEntry);
      }

      // Update Transformations (Position X, Y, Z, Scale, Rotation, Opacity)
      const posX = (layer.x - centerX) * 0.62;
      const posY = -(layer.y - centerY) * 0.62;
      const posZ = index * 14 + (layer.z || 0);

      meshEntry.group.position.set(posX, posY, posZ);
      meshEntry.group.rotation.z = (-layer.rotation * Math.PI) / 180;
      meshEntry.group.scale.set(layer.scaleX, layer.scaleY, 1);

      meshEntry.group.traverse(child => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.opacity = layer.opacity;
          mat.transparent = layer.opacity < 1 || mat.transparent;
        }
      });
    });
  }, [layers, aspectRatio, materialStyle]);

  return (
    <div
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing overflow-hidden transition-all duration-300"
      style={{
        ...getBackgroundCssStyle(background),
        touchAction: 'none', // Crucial for Android touch orbit controls
      }}
    >
      <div ref={containerRef} className="w-full h-full" style={{ touchAction: 'none' }} />

      {/* 3D Floating Mobile-Friendly Touch Control Bar (Top-Right) */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950/85 border border-zinc-700/80 shadow-2xl backdrop-blur-md">
        {/* Reset Camera */}
        <button
          id="btn-3d-reset-cam"
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 active:scale-95 text-zinc-300 transition-all"
          title="Centrar vista 3D"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* 360 Auto-Rotate Toggle */}
        <button
          id="btn-3d-auto-rotate"
          onClick={toggleAutoRotate}
          className={`p-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
            internalAutoRotate
              ? 'bg-amber-400 text-zinc-950 shadow-md'
              : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
          }`}
          title="Giro 360° automático"
        >
          <RotateCw className={`w-4 h-4 ${internalAutoRotate ? 'animate-spin' : ''}`} />
          <span className="text-[10px] hidden sm:inline">360°</span>
        </button>

        {/* Zoom In / Out Touch Buttons for Mobile Android */}
        <button
          id="btn-3d-zoom-in"
          onClick={() => handleZoom(1)}
          className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 active:scale-95 text-zinc-300 transition-all"
          title="Acercar (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="btn-3d-zoom-out"
          onClick={() => handleZoom(-1)}
          className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 active:scale-95 text-zinc-300 transition-all"
          title="Alejar (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-zinc-700 mx-0.5" />

        {/* 3D Material / Finish Switcher */}
        <div className="flex items-center gap-1">
          {(['toy', 'metallic', 'glossy'] as MaterialStyle3D[]).map(style => (
            <button
              key={style}
              onClick={() => setMaterialStyle(style)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                materialStyle === style
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {style === 'toy' ? 'Toy 🧸' : style === 'metallic' ? 'Oro 🌟' : 'Gloss ✨'}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State Overlay */}
      {layers.length === 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
          <div className="text-center p-5 sm:p-6 rounded-3xl bg-zinc-900/85 border border-zinc-800 backdrop-blur-md max-w-xs shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-3 font-bold text-xl border border-amber-400/30">
              ✨
            </div>
            <h4 className="text-sm font-bold text-zinc-100 mb-1">Escenario 3D Listo</h4>
            <p className="text-xs text-zinc-400">
              Agrega cualquier forma, cara o texto desde la barra inferior para verlos convertidos en figuras 3D coleccionables.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
