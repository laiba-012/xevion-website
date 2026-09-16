import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShieldLock3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0x3b82f6, 0.6));
    const glowLight = new THREE.PointLight(0x38bdf8, 3, 10);
    glowLight.position.set(0, 0, 2);
    scene.add(glowLight);

    // Lock group (body + shackle)
    const lock = new THREE.Group();

    const bodyGeo = new THREE.BoxGeometry(1.1, 0.9, 0.5);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.4,
      metalness: 0.7,
      roughness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    lock.add(body);

    const edges = new THREE.EdgesGeometry(bodyGeo);
    const edgeLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
    body.add(edgeLines);

    const shackleGeo = new THREE.TorusGeometry(0.5, 0.09, 16, 60, Math.PI);
    const shackleMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    });
    const shackle = new THREE.Mesh(shackleGeo, shackleMat);
    shackle.rotation.z = Math.PI;
    shackle.position.set(0, 0.5, 0);
    lock.add(shackle);

    scene.add(lock);

    // Floating particles around the lock
    const count = 150;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.03, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let frameId;
    const animate = () => {
      lock.rotation.y += 0.006;
      lock.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      particles.rotation.y -= 0.001;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      bodyGeo.dispose(); bodyMat.dispose();
      shackleGeo.dispose(); shackleMat.dispose();
      particleGeo.dispose(); particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "500px" }} />;
}