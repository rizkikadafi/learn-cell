import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gridHelper = new THREE.GridHelper(10);
// scene.add(gridHelper);

// Menambahkan OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Efek mengurangi getaran rotasi
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 1; // Zoom minimum
controls.maxDistance = 10; // Zoom maksimum

// Pencahayaan
const dlight = new THREE.DirectionalLight(0xffffff, 2);
dlight.position.set(0, 2, 2).normalize();
scene.add(dlight);

const dlight2 = new THREE.DirectionalLight(0xffffff, 2);
dlight2.position.set(0, 2, -2).normalize();
scene.add(dlight2);

const dlightHelper = new THREE.DirectionalLightHelper(dlight);
// scene.add(dlightHelper);

// Memuat model GLTF
const loader = new GLTFLoader();
loader.load(
  '/human_cell/cell.glb', function(gltf) {
    scene.add(gltf.scene);
    gltf.scene.scale.set(0.5, 0.5, 0.5); // Mengatur ukuran model (opsional)
    gltf.scene.position.set(0, 0, 0); // Mengatur posisi model (opsional)
  },

  function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function(error) {
    console.error('An error happened', error);
  }
);


// Raycaster untuk deteksi klik
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Box untuk menampilkan penjelasan
const infoBox = document.getElementById('info-box');
const infoText = document.getElementById('info-text');

// Fungsi untuk menangani klik pada objek
function onMouseClick(event) {
  // Mengambil posisi mouse dalam normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Mencari objek yang diklik
  const intersects = raycaster.intersectObjects(scene.children, true);
  // console.log(intersects)
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object.parent;
    const componentName = clickedObject.userData.name;
    console.log(componentName);

    let cellComponents = {
      'nucleus': { name: 'Nucleus', description: 'The nucleus is the control center of the cell.' },
      'mitocondria': { name: 'Mitocondria', description: 'The mitochondria is the powerhouse of the cell.' },
    };

    if (cellComponents[componentName]) {
      const componentInfo = cellComponents[componentName];

      // Menampilkan informasi
      infoBox.style.display = 'block';
      infoText.innerHTML = `<strong>${componentInfo.name}</strong><br>${componentInfo.description}`;

    }
    // infoBox.style.display = 'block';
    // infoText.innerHTML = `<strong>${componentName}</strong><br>`;
  }
}

// Event listener untuk klik mouse
window.addEventListener('click', onMouseClick);

// Posisi kamera
camera.position.set(0, 0, 2);

// Animasi
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
