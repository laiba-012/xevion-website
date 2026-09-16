import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MdShield, MdLock, MdSpeed, MdAutorenew } from 'react-icons/md';

const TERMINAL_LOGS = [
  { time: '11:20:04', tag: 'CORE', text: 'Quantum mesh synchronized (24 nodes active)', color: '#38bdf8' },
  { time: '11:20:06', tag: 'ZERO-DAY', text: 'Real-time heuristic scan: 0 anomalies', color: '#10b981' },
  { time: '11:20:08', tag: 'FIREWALL', text: 'Perimeter Layer-7 filter armed and active', color: '#0084ff' },
  { time: '11:20:10', tag: 'ENCRYPT', text: '256-Bit Quantum TLS Handshake verified', color: '#a855f7' },
  { time: '11:20:12', tag: 'INTERCEPT', text: 'Vector #4891 deflected to honeypot', color: '#f59e0b' },
  { time: '11:20:15', tag: 'STATUS', text: 'Shield integrity: 100% • Optimal state', color: '#10b981' },
];

export default function Cyber3DScene() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [logIndex, setLogIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [scanSpeed, setScanSpeed] = useState(1);
  const [nodeCount, setNodeCount] = useState(1480);

  // Cycle terminal logs smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % TERMINAL_LOGS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Three.js 3D Interactive Cyber Sphere
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 3. Main Interactive Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x0084ff, 3.5, 30);
    blueLight.position.set(4, 3, 5);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 3, 30);
    cyanLight.position.set(-4, -3, 5);
    scene.add(cyanLight);

    // 5. Central 3D Ribbon Emblem Texture Plane
    const textureLoader = new THREE.TextureLoader();
    let emblemMesh = null;
    textureLoader.load(
      '/xevion-symbol.png',
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        const emblemGeo = new THREE.PlaneGeometry(1.85, 1.85);
        const emblemMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.96,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
        emblemMesh.renderOrder = 2;
        mainGroup.add(emblemMesh);
      },
      undefined,
      (err) => console.warn('Could not load /xevion-symbol.png for 3D core', err)
    );

    // 6. Holographic Outer Geodesic Sphere
    const outerGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x0084ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const outerSphere = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerSphere);

    // 7. Holographic Inner Core Octahedron
    const innerGeo = new THREE.OctahedronGeometry(1.5, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerCore);

    // 8. Cyber Defense Particles (Threat Matrix Cloud)
    const particleCount = 450;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x0084ff);
    const c2 = new THREE.Color(0x38bdf8);
    const c3 = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.3 + Math.random() * 0.7;

      const sinPhi = Math.sin(phi);
      particlePositions[i * 3] = r * sinPhi * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const chosenColor = Math.random() > 0.6 ? c2 : Math.random() > 0.2 ? c1 : c3;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleCloud);

    // 9. Cyber Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.8, 0.014, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(3.15, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x0084ff,
      transparent: true,
      opacity: 0.45,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // Satellite Data Nodes
    const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const satMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const sat1 = new THREE.Mesh(satGeo, satMat1);
    ring1.add(sat1);

    const satMat2 = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const sat2 = new THREE.Mesh(satGeo, satMat2);
    ring2.add(sat2);

    // 10. Mouse Drag & Hover Interaction State
    let targetRotationX = 0.15;
    let targetRotationY = 0.2;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let speedMultiplier = 1;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        const normX = (x / width) * 2 - 1;
        const normY = -(y / height) * 2 + 1;
        targetRotationY = normX * 0.45;
        targetRotationX = -normY * 0.35;
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 500;
      height = container.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 11. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentSpeed = speedMultiplier;

      if (!isDragging) {
        targetRotationY += 0.0025 * currentSpeed;
      }

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.06;

      outerSphere.rotation.y = -elapsedTime * 0.12 * currentSpeed;
      outerSphere.rotation.z = elapsedTime * 0.08 * currentSpeed;

      innerCore.rotation.y = elapsedTime * 0.25 * currentSpeed;
      innerCore.rotation.x = elapsedTime * 0.18 * currentSpeed;

      ring1.rotation.z = elapsedTime * 0.35 * currentSpeed;
      ring2.rotation.z = -elapsedTime * 0.25 * currentSpeed;

      sat1.position.x = Math.cos(elapsedTime * 1.8 * currentSpeed) * 2.8;
      sat1.position.y = Math.sin(elapsedTime * 1.8 * currentSpeed) * 2.8;

      sat2.position.x = Math.cos(-elapsedTime * 1.4 * currentSpeed) * 3.15;
      sat2.position.y = Math.sin(-elapsedTime * 1.4 * currentSpeed) * 3.15;

      const scale = 1 + Math.sin(elapsedTime * 2) * 0.025;
      particleCloud.scale.set(scale, scale, scale);

      if (emblemMesh) {
        emblemMesh.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    container._setSpeed = (s) => {
      speedMultiplier = s;
    };
    container._resetView = () => {
      targetRotationX = 0;
      targetRotationY = 0;
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);

      [outerGeo, innerGeo, particleGeo, ring1Geo, ring2Geo, satGeo].forEach((g) => g.dispose());
      [outerMat, innerMat, particleMat, ring1Mat, ring2Mat, satMat1, satMat2].forEach((m) => m.dispose());
      if (emblemMesh) {
        emblemMesh.geometry.dispose();
        emblemMesh.material.dispose();
      }
      renderer.dispose();
    };
  }, []);

  const toggleSpeed = () => {
    const nextSpeed = scanSpeed === 1 ? 2.8 : 1;
    setScanSpeed(nextSpeed);
    if (containerRef.current?._setSpeed) {
      containerRef.current._setSpeed(nextSpeed);
    }
  };

  const handleReset = () => {
    if (containerRef.current?._resetView) {
      containerRef.current._resetView();
    }
  };

  const currentLog = TERMINAL_LOGS[logIndex];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 480,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        userSelect: 'none',
      }}
      className="cyber-3d-wrapper"
    >
      {/* Background Radial Glow & Cyber Grid Spotlight */}
      <div
        style={{
          position: 'absolute',
          width: '92%',
          height: '92%',
          maxWidth: 460,
          maxHeight: 460,
          background: 'radial-gradient(circle, rgba(0, 132, 255, 0.24) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 72%)',
          borderRadius: '50%',
          filter: 'blur(35px)',
          pointerEvents: 'none',
          animation: 'pulseGlow 6s ease-in-out infinite',
        }}
      />

      {/* THREE.JS WebGL Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: isInteracting ? 'grabbing' : 'grab',
          position: 'relative',
          zIndex: 2,
        }}
        title="Click and drag to rotate 3D defense core"
      />

      {/* Top Floating Telemetry HUD: Zero-Trust Defense Status (Top-Right) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 5,
          padding: '12px 16px',
          background: 'rgba(10, 15, 34, 0.90)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 132, 255, 0.35)',
          borderRadius: 14,
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65), 0 0 25px rgba(0, 132, 255, 0.15)',
          maxWidth: 230,
          transition: 'transform 0.3s ease, border-color 0.3s ease',
        }}
        className="hud-card"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <MdShield style={{ color: '#0084ff', fontSize: 18 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
              Zero-Trust Shield
            </span>
          </div>
          <span
            style={{
              fontSize: 9,
              padding: '2px 7px',
              borderRadius: 4,
              background: 'rgba(16, 185, 129, 0.18)',
              color: '#10b981',
              fontWeight: 700,
              border: '1px solid rgba(16, 185, 129, 0.35)',
              letterSpacing: '0.05em',
            }}
          >
            ACTIVE
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
          <span>Threat Interception:</span>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>99.98%</span>
        </div>

        <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              width: '99.98%',
              height: '100%',
              background: 'linear-gradient(90deg, #0084ff, #38bdf8)',
              boxShadow: '0 0 8px rgba(56, 189, 248, 0.7)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
            Lat: <strong style={{ color: '#10b981' }}>14ms</strong>
          </span>
          <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
            Nodes: <strong style={{ color: '#38bdf8' }}>{nodeCount}</strong>
          </span>
        </div>
      </div>

      {/* Bottom Floating Interactive Terminal (Bottom-Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: 5,
          left: 0,
          zIndex: 5,
          maxWidth: 280,
          width: '92%',
          background: 'rgba(8, 12, 26, 0.94)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 132, 255, 0.28)',
          borderRadius: 12,
          boxShadow: '0 25px 50px rgba(0,0,0,0.7), 0 0 30px rgba(0, 132, 255, 0.12)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
        className="hud-card"
      >
        {/* Terminal Title Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 12px',
            background: 'rgba(0, 132, 255, 0.08)',
            borderBottom: '1px solid rgba(0, 132, 255, 0.15)',
          }}
        >
          <div style={{ display: 'flex', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
          </div>
          <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
            xevion-telemetry ~ live
          </span>
          <MdLock style={{ fontSize: 11, color: '#38bdf8' }} />
        </div>

        {/* Dynamic Terminal Body */}
        <div style={{ padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, lineHeight: 1.55 }}>
          <div style={{ color: '#64748b', marginBottom: 2 }}>
            <span style={{ color: '#38bdf8' }}>$</span> live-intercept --stream
          </div>
          <div
            key={currentLog.text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#f8fafc',
            }}
          >
            <span
              style={{
                color: currentLog.color,
                fontWeight: 700,
                fontSize: 9,
                padding: '1px 4px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 3,
                flexShrink: 0,
              }}
            >
              [{currentLog.tag}]
            </span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentLog.text}
            </span>
          </div>
          <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 9 }}>
            <span>Time: {currentLog.time}</span>
            <span style={{ color: '#10b981' }}>● Intercepted</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Pill (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: 5,
          right: 0,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* Speed / Turbo Toggle */}
        <button
          type="button"
          onClick={toggleSpeed}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 11px',
            background: scanSpeed > 1 ? 'rgba(0, 132, 255, 0.25)' : 'rgba(10, 15, 34, 0.88)',
            border: `1px solid ${scanSpeed > 1 ? '#0084ff' : 'rgba(0, 132, 255, 0.3)'}`,
            borderRadius: 20,
            color: scanSpeed > 1 ? '#38bdf8' : '#94a3b8',
            fontSize: 10,
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.25s ease',
          }}
          title="Toggle Rotation Speed"
        >
          <MdSpeed style={{ fontSize: 13, color: scanSpeed > 1 ? '#38bdf8' : '#64748b' }} />
          <span>{scanSpeed > 1 ? 'Turbo 2.8x' : '1.0x'}</span>
        </button>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={handleReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 9px',
            background: 'rgba(10, 15, 34, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 20,
            color: '#94a3b8',
            fontSize: 10,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.25s ease',
          }}
          title="Center 3D View"
        >
          <MdAutorenew style={{ fontSize: 13 }} />
        </button>
      </div>

      {/* Floating 3D Interaction Hint Badge (Top Left) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: 'rgba(10, 14, 30, 0.85)',
          border: '1px solid rgba(0, 132, 255, 0.25)',
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            animation: 'blink 1.2s infinite',
          }}
        />
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            color: '#38bdf8',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.04em',
          }}
        >
          3D INTERACTIVE CORE • DRAG TO ROTATE
        </span>
      </div>
    </div>
  );
}
