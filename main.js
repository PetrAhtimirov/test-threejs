import {
    Scene,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    AmbientLight,
    PlaneGeometry,
    Color,
    DirectionalLight,
    PointLight,
    SpotLight
} from 'three';
import { camera, initializeControls, handleKeyPressCamera } from './camera.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Инициализация сцены
const scene = new Scene();
scene.background = new Color(0xececec);

// Инициализация рендерера
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Инициализация контроллеров
initializeControls(renderer.domElement);

// Создание пола
const createFloor = () => {
    const floorGeometry = new PlaneGeometry(100, 100);
    const floorMaterial = new MeshBasicMaterial({ color: 0xadbea9, side: 2 });
    const floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
};

// Загрузка модели
let catModel;
const loadModel = () => {
    const loader = new GLTFLoader();
    loader.load('models/oiiaioooooiai_cat.glb', (gltf) => {
        catModel = gltf.scene;
        catModel.scale.set(2, 2, 2);
        catModel.position.set(0, 0, 0);
        scene.add(catModel);
    }, undefined, (error) => {
        console.error(error);
    });
};

// Добавление освещения
const addLights = () => {
    const ambientLight = new AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const pointLight1 = new PointLight(0xffffff, 1, 100);
    pointLight1.position.set(0, 10, 0);
    scene.add(pointLight1);

    const pointLight2 = new PointLight(0xff0000, 1, 100); // Красный свет
    pointLight2.position.set(-10, 5, 10);
    scene.add(pointLight2);

    const spotLight = new SpotLight(0xffffff, 1);
    spotLight.position.set(10, 10, 10);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.2;
    scene.add(spotLight);
};

// Функция анимации
const animate = () => {
    if (catModel) {
        catModel.rotation.y += 0.003;
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Обработка нажатий клавиш
window.addEventListener('keydown', handleKeyPressCamera);

// Инициализация сцены
createFloor();
loadModel();
addLights();
animate();
