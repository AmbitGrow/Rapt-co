import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import earthDay from "../../assets/earth/earth_day_2k.jpg";
import earthNormal from "../../assets/earth/earth_normal_2k.jpg";
import earthBump from "../../assets/earth/earth_bump_2k.jpg";
import earthSpecular from "../../assets/earth/earth_specular_2k.jpg";
import earthClouds from "../../assets/earth/earth_clouds_2k.webp";
import earthNight from "../../assets/earth/earth_night_2k.jpg";

const earthTextures = {
  map: earthDay,
  normalMap: earthNormal,
  bumpMap: earthBump,
  roughnessMap: earthSpecular,
  specularMap: earthSpecular,
  nightMap: earthNight,
  cloudMap: earthClouds,
};

class EarthTextureBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <FallbackEarth /> : this.props.children;
  }
}

function FallbackEarth() {
  const earthRef = useRef(null);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0005 * delta * 60;
  });

  return (
    <group position={[0, 0, 0]} scale={0.9} rotation={[0.08, 0, THREE.MathUtils.degToRad(-23.5)]}>
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 96, 96]} />
        <meshStandardMaterial color="#2d6f9f" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

function Earth() {
  const earthRef = useRef(null);
  const cloudRef = useRef(null);
  const cloudElapsedRef = useRef(0);
  const textures = useTexture(earthTextures);
  const normalScale = useMemo(() => new THREE.Vector2(1, 1), []);
  const cloudGeometry = useMemo(
    () => new THREE.SphereGeometry(1.2 * 1.008, 128, 128),
    [],
  );

  textures.map.colorSpace = THREE.SRGBColorSpace;
  textures.nightMap.colorSpace = THREE.SRGBColorSpace;
  textures.cloudMap.colorSpace = THREE.SRGBColorSpace;
  textures.map.anisotropy = 16;
  textures.normalMap.anisotropy = 16;
  textures.bumpMap.anisotropy = 16;
  textures.roughnessMap.anisotropy = 16;
  textures.specularMap.anisotropy = 16;
  textures.nightMap.anisotropy = 16;
  textures.cloudMap.anisotropy = 16;

  useEffect(
    () => () => {
      Object.values(textures).forEach((texture) => texture.dispose());
      Object.values(earthTextures).forEach((url) => useTexture.clear(url));
      cloudGeometry.dispose();
    },
    [cloudGeometry, textures],
  );

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0005 * delta * 60;
    cloudElapsedRef.current += delta;
    if (cloudRef.current) {
      const baseSpeed = 0.0005 * (0.16 / 0.12);
      const variation = Math.sin(cloudElapsedRef.current * 0.08) * 0.00015;
      cloudRef.current.rotation.y += (baseSpeed + variation) * delta * 60;
    }
  });

  return (
    <group
      position={[0, 0, 0]}
      scale={0.9}
      rotation={[0.08, 0, THREE.MathUtils.degToRad(-23.5)]}
    >
      <mesh ref={earthRef} rotation={[0, -0.45, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 128, 128]} />
        <meshStandardMaterial
          map={textures.map}
          normalMap={textures.normalMap}
          normalScale={normalScale}
          bumpMap={textures.bumpMap}
          bumpScale={0.04}
          roughnessMap={textures.roughnessMap}
          roughness={0.9}
          metalness={0}
          emissive="#ffffff"
          emissiveMap={textures.nightMap}
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh
        ref={cloudRef}
        rotation={[0, -0.4, 0]}
        castShadow={false}
        receiveShadow={false}
      >
        <primitive object={cloudGeometry} attach="geometry" />
        <meshPhongMaterial
          map={textures.cloudMap}
          bumpMap={textures.cloudMap}
          bumpScale={0.003}
          color="#ffffff"
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          depthWrite={false}
          shininess={2}
          specular="#dcefff"
          emissive="#1b2730"
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh scale={1.015}>
        <sphereGeometry args={[1.2, 96, 96]} />
        <meshBasicMaterial
          color="#8ed7ff"
          opacity={0.12}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function GlobeArtwork({ active = true }) {
  const controlsRef = useRef(null);
  const resumeRotationTimer = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(
    () => () => {
      if (resumeRotationTimer.current) clearTimeout(resumeRotationTimer.current);
    },
    [],
  );

  const pauseRotation = useCallback(() => {
    if (resumeRotationTimer.current) clearTimeout(resumeRotationTimer.current);
    setAutoRotate(false);
  }, []);

  const scheduleRotationResume = useCallback(() => {
    if (resumeRotationTimer.current) clearTimeout(resumeRotationTimer.current);
    resumeRotationTimer.current = setTimeout(() => setAutoRotate(true), 2000);
  }, []);

  return (
    <Canvas
      className="experience-artwork"
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6.3], fov: 28 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        gl.physicallyCorrectLights = true;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
      role="img"
      aria-label="Interactive rotating three-dimensional Earth"
    >
      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#dff3ff", "#b7c9d6", 1.1]} />
      <directionalLight
        position={[-6, 6, 8]}
        intensity={2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-radius={8}
      />
      <directionalLight position={[6, 1, 5]} color="#a8d8ff" intensity={0.8} />
      <directionalLight position={[0, 2, -8]} color="#ffffff" intensity={1.4} />
      <spotLight
        position={[0, 8, 5]}
        angle={0.45}
        penumbra={1}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-radius={8}
      />

      <Suspense fallback={null}>
        <EarthTextureBoundary>
          <Earth />
        </EarthTextureBoundary>
      </Suspense>

      <ContactShadows
        position={[0, -1.38, 0]}
        opacity={0.18}
        scale={5}
        blur={4}
        far={4}
        color="#000000"
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={[0, 0, 0]}
        enableRotate
        enableZoom
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        minDistance={4.8}
        maxDistance={7.5}
        autoRotate={autoRotate}
        autoRotateSpeed={0.12}
        onStart={pauseRotation}
        onEnd={scheduleRotationResume}
        minPolarAngle={Math.PI * 0.16}
        maxPolarAngle={Math.PI * 0.84}
      />
    </Canvas>
  );
}
