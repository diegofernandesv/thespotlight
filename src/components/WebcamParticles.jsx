import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { div, floorDiv } from "@tensorflow/tfjs";

const vertexSource = `
attribute vec3 color;
uniform float time;
uniform float size;
varying vec3 vColor;
varying float vGray;
void main() {
    vColor = color;
    vGray = (vColor.x + vColor.y + vColor.z) / 3.0;

    gl_PointSize = size * vGray * 3.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

const fragmentSource = `
varying vec3 vColor;
varying float vGray;
void main() {
    float gray = vGray;

    if(gray > 0.5){
        gray = 0.0;
    }else{
        gray = 1.0;
    }

    gl_FragColor = vec4(vColor, gray);
}
`;

export default function WebcamParticles() {
  const canvasRef = useRef(null);
  const webCamRef = useRef(null);

  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const particlesRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setClearColor(0x000000, 1); // black background
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 25, 0);  // Positioned back and above particles
    camera.lookAt(0, 0, 0);          // Look at center
    cameraRef.current = camera;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    scene.add(directionalLight);

    // Handle resize
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const video = document.createElement('video');
    video.autoplay = true;
    video.width = 640;
    video.height = 480;
    webCamRef.current = video;

    const option = { video: true, audio: false };

    navigator.mediaDevices.getUserMedia(option)
      .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          createParticles();
          animate();
        };
      })
      .catch((e) => {
        alert("ERROR: " + e.message);
      });

    return () => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getImageData = (video) => {
    if (!video || video.readyState < 2) return null;
    const w = video.videoWidth;
    const h = video.videoHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  };

  const createParticles = () => {
    const video = webCamRef.current;
    const imageData = getImageData(video);
    if (!imageData) return;

    const geometry = new THREE.BufferGeometry();
    const vertices_base = [];
    const colors_base = [];

    const width = imageData.width;
    const height = imageData.height;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const posX = 0.03 * (-x + width / 2);
        const posY = 0;
        const posZ = 0.03 * (y - height / 2);
        vertices_base.push(posX, posY, posZ);

        const r = 0.0;
        const g = 0.0;
        const b = 0.3 + 0.7 * Math.random();
        colors_base.push(r, g, b);
      }
    }

    const vertices = new Float32Array(vertices_base);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const colors = new Float32Array(colors_base);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        size: { value: 2.0 },
      },
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
    particlesRef.current = particles;
  };

  const animate = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const particles = particlesRef.current;
    const video = webCamRef.current;

    if (!renderer || !scene || !camera || !particles || !video) return;

    const renderLoop = () => {
      if (particles) {
        const imageData = getImageData(video);
        if (imageData) {
          const length = particles.geometry.attributes.position.count;

          for (let i = 0; i < length; i++) {
            const index = i * 4;
            const r = imageData.data[index] / 255;
            const g = imageData.data[index + 1] / 255;
            const b = imageData.data[index + 2] / 255;
            const gray = (r + g + b) / 3;

            particles.geometry.attributes.position.setY(i, gray * 10);
          }
          particles.geometry.attributes.position.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(renderLoop);
    };

    renderLoop();
  };

  return (
    <canvas id="myCanvas" ref={canvasRef} style={{ display: 'block' }} />
  );
}
