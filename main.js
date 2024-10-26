import { Scene, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, AmbientLight, PlaneGeometry, Color } from 'three';
import { camera, initializeControls, handleKeyPressCamera } from './camera.js';

// Создание сцены
const scene = new Scene();
scene.background = new Color(0xececec);

// Создание рендерера
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Инициализация контроллеров
initializeControls(renderer.domElement);

// Создание куба
const geometry = new BoxGeometry(1, 1, 1); // Размеры куба
const material = new MeshBasicMaterial({ color: 0x00ff00 }); // Цвет куба
const cube = new Mesh(geometry, material); // Создание меша
cube.position.y = 1;
scene.add(cube); // Добавление куба в сцену

// Создание пола
const floorGeometry = new PlaneGeometry(100, 100); // Размеры пола
const floorMaterial = new MeshBasicMaterial({ color: 0xadbea9, side: 2 }); // Цвет пола
const floor = new Mesh(floorGeometry, floorMaterial); // Создание меша для пола
floor.rotation.x = - Math.PI / 2; // Поворот пола, чтобы он был горизонтальным
scene.add(floor); // Добавление пола в сцену

// Освещение
var light = new AmbientLight(0x404040); // мягкий белый свет
scene.add(light);

// Функция анимации
function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Обработка нажатий клавиш
window.addEventListener('keydown', handleKeyPressCamera);

// Запуск анимации
animate();
