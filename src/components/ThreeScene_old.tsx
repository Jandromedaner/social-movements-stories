"use client"; // This is a client component 👈🏽

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";

function GlobeContent() {
  const { scene, gl, camera } = useThree();
  const markersRef = useRef([]);

  const handleClick = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markersRef.current);

    if (intersects.length > 0) {
      console.log("Marker clicked:", intersects[0].object.userData);
      const { title, lat, lon } = intersects[0].object.userData;
      setPopup({ title, lat, lon });
    } else {
      setPopup(null);
    }
  };
  // return globe and markers
}

interface TargetPosition {
  x: number;
  y: number;
  z: number;
}

function ThreeScene: React.FC = () {
  const mountRef = useRef(null); // This ref will hold the div where the renderer attaches
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [popup, setPopup] = useState(null);
  const markersRef = useRef([]);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // TODO download geojson worldmap and display all countries
  function createMarkersFromGeoJson(geoJson, earthGroup, radius) {
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    geoJson.features.forEach((feature) => {
      // Assume coordinates array is [longitude, latitude]
      const [lon, lat] = feature.geometry.coordinates; // You may need to adjust this based on your GeoJSON structure
      const position = latLongToVector3(lat, lon, radius);

      const geometry = new THREE.SphereGeometry(0.1, 32, 32); // Small sphere for each country
      const marker = new THREE.Mesh(geometry, material);
      marker.position.copy(position);
      marker.position.multiplyScalar(1.01); // Position slightly above the globe surface to avoid z-fighting
      earthGroup.add(marker);
    });
  }

  useEffect(() => {
    // Ensure all this code only runs on the client side
    if (typeof window === "undefined") {
      return;
    }

    const scene = new THREE.Scene();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    scene.background = new THREE.CubeTextureLoader().load([
      "/img/px_eso0932a.jpeg",
      "/img/nx_eso0932a.jpeg",
      "/img/py_eso0932a.jpeg",
      "/img/ny_eso0932a.jpeg",
      "/img/pz_eso0932a.jpeg",
      "/img/nz_eso0932a.jpeg",
    ]);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.autoRotation = true;
    controls.dampingFactor = 0.25;

    const sunLight = new THREE.DirectionalLight(0xffffff);
    sunLight.position.set(-2, 0.5, 1.5);
    scene.add(sunLight);

    const textureLoader = new THREE.TextureLoader();
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("/img/00_earthmap8k.jpg"),
      bumpMap: textureLoader.load("/img/01_earthbump1k.jpg"),
      bumpScale: 0.04,
      specularMap: textureLoader.load("/img/02_earthspec1k.jpg"),
      // specular: new THREE.Color("grey"),
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("/img/04_earthcloudmap8k.jpg"),
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      alphaMap: textureLoader.load("/img/05_earthcloudmaptrans.jpg"),
      // alphaTest: 0.3,
    });
    const cloudsMesh = new THREE.Mesh(earthGeometry, cloudMaterial);
    cloudsMesh.scale.setScalar(1.003);
    earthGroup.add(cloudsMesh);

    const lightsMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load("/img/03_earthlights8k.jpg"),
      blending: THREE.AdditiveBlending,
    });
    const lightsMesh = new THREE.Mesh(earthGeometry, lightsMaterial);
    earthGroup.add(lightsMesh);

    // Adjust camera settings if needed
    camera.position.z = 2;

    function getFresnelMat({ rimHex = 0x67b8ff, facingHex = 0x000000 } = {}) {
      const uniforms = {
        color1: { value: new THREE.Color(rimHex) },
        color2: { value: new THREE.Color(facingHex) },
        fresnelBias: { value: 0.1 },
        fresnelScale: { value: 1.0 },
        fresnelPower: { value: 4.0 },
      };
      const vs = `
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;

      varying float vReflectionFactor;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

        vec3 I = worldPosition.xyz - cameraPosition;

        vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );

        gl_Position = projectionMatrix * mvPosition;
      }
      `;
      const fs = `
      uniform vec3 color1;
      uniform vec3 color2;

      varying float vReflectionFactor;

      void main() {
        float f = clamp( vReflectionFactor, 0.0, 1.0 );
        gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
      }
      `;
      const fresnelMat = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
        blending: THREE.AdditiveBlending,
        wireframe: true, // Grit
      });
      return fresnelMat;
    }

    function getStarfield({ numStars = 1000 } = {}) {
      function randomSpherePoint() {
        const radius = Math.random() * 25 + 25;
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        let x = radius * Math.sin(phi) * Math.cos(theta);
        let y = radius * Math.sin(phi) * Math.sin(theta);
        let z = radius * Math.cos(phi);

        return {
          pos: new THREE.Vector3(x, y, z),
          hue: 0.6,
          minDist: radius,
        };
      }
      const verts = [];
      const colors = [];
      const positions = [];
      let col;
      for (let i = 0; i < numStars; i += 1) {
        let p = randomSpherePoint();
        const { pos, hue } = p;
        positions.push(p);
        col = new THREE.Color().setHSL(hue, 0.2, Math.random());
        verts.push(pos.x, pos.y, pos.z);
        colors.push(col.r, col.g, col.b);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        map: new THREE.TextureLoader().load("/img/stars/circle.png"),
      });
      const points = new THREE.Points(geo, mat);
      return points;
    }

    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(earthGeometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);
    earthGroup.add(glowMesh);

    const stars = getStarfield({ numStars: 2000 });
    scene.add(stars);
    // set controls and camera so we can manipulate them in a function (e.g. handleCameraMove)
    controlsRef.current = controls;
    cameraRef.current = camera;

    const globeRadius = 1;

    // place markers manually or create them from geojson with the function found at the top of this file
    markersRef.current.push(
      addPeaceMarker(
        earthGroup,
        44.2601,
        -72.5754,
        "Peace of Paris 1783",
        globeRadius,
        setPopup,
      ),
    );

    // animate
    function animate() {
      requestAnimationFrame(animate);

      const rotationY = 0.001;
      // earthMesh.rotation.y += rotationY;
      // lightsMesh.rotation.y += rotationY;
      // cloudsMesh.rotation.y += rotationY;
      // glowMesh.rotation.y += rotationY;
      stars.rotation.y -= 0.00005;
      // addPeaceMarker(earthGroup, globeRadius);

      renderer.render(scene, camera);
      controls.update();
    }

    animate();

    // handle Windows Resize
    function handleWindowsResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleWindowsResize, false);
    window.addEventListener("click", handleClick);
    // Clean up on unmount
    return () => {
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
        scene.remove(earthGroup);
        earthGroup.children.forEach((child) => earthGroup.remove(child));
      }
      window.removeEventListener("click", handleClick);
      // displacementMap.dispose();
    };
  }, []);

  const latLongToVector3 = (lat, lon, radius) => {
    let phi = ((90 - lat) * Math.PI) / 180; // Convert latitude to radians
    let theta = ((lon + 180) * Math.PI) / 180; // Convert longitude to radians

    let x = -radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.cos(phi); // Height based on latitude
    let z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  };

  // Function to animate camera move
  const handleCameraMove = (lat, lon) => {
    if (cameraRef.current && controlsRef.current) {
      const globeRadius = 1; // Radius of your globe
      const viewDistance = 0.7; // Distance from the globe surface you want the camera to be
      const targetPosition = latLongToVector3(lat, lon, globeRadius);
      const cameraPosition = latLongToVector3(
        lat,
        lon,
        globeRadius + viewDistance,
      );

      gsap.to(cameraRef.current.position, {
        duration: 2,
        x: cameraPosition.x,
        y: cameraPosition.y,
        z: cameraPosition.z,
        onUpdate: () => {
          cameraRef.current.lookAt(targetPosition);
          controlsRef.current.update();
        },
      });
    }
  };

  function getCurrentPosition(lat, lon, radius, rotationY) {
    let phi = ((90 - lat) * Math.PI) / 180;
    let theta = ((lon + 180) * Math.PI) / 180;

    let x = -radius * Math.sin(phi) * Math.cos(theta - rotationY);
    let y = radius * Math.cos(phi);
    let z = radius * Math.sin(phi) * Math.sin(theta - rotationY);

    return new THREE.Vector3(x, y, z);
  }

  function addPeaceMarker(earthGroup, lat, lon, title, radius, setPopup) {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(geometry, material);

    const position = latLongToVector3(lat, lon, radius);
    marker.position.copy(position);
    marker.position.multiplyScalar(1.01);
    marker.userData = { title, lat, lon }; // seems to not work yet

    marker.callback = () => {
      setPopup({ title, lat, lon });
    };

    earthGroup.add(marker);
    return marker;
  }

  return (
    <Canvas>
      <div
      className="relative w-full h-screen"
      onClick={(e) => console.log("Canvas clicked")}
      />
      {/* Three.js Canvas */}
      <div ref={mountRef} />
    </Canvas>
      {/* ... (other buttons for Tokyo, Buenos Aires, etc.) */}

      {/* Logo, Title and Text */}
      {/* <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center">
        <img
          src="/img/output.png"
          alt="Fonterra Logo"
          className="md:mx-auto px-4 mb-2"
        />
        <h1 className="text-3xl font-bold text-white mb-1">Dairy for life</h1>
        <p className="text-lg text-white mb-4">
          Taking dairy innovation and nutrition to the world
        </p>
      </div> */}

      {/* Explore Stories Button and Downward Arrow */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <button
          className="bg-white text-teal-700 font-semibold py-2 px-4 border border-teal-500 rounded shadow"
          onClick={() => handleCameraMove(48.8566, 2.3522)}
        >
          Go to Paris
        </button>
        <button
          className="bg-white text-teal-700 font-semibold py-2 px-4 border border-teal-500 rounded shadow"
          onClick={() => handleCameraMove(35.652832, 139.839478)}
        >
          Go to Tokyo
        </button>
        <button className="bg-white text-teal-700 font-semibold py-2 px-4 border border-teal-500 rounded shadow">
          Explore Stories
        </button>
        <div className="animate-bounce mt-2">
          {/* SVG for Downward Arrow */}
          <svg
            className="mx-auto h-6 w-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ThreeScene;
