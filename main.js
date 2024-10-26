import { Scene, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { camera, initializeControls, handleKeyPressCamera, updateCameraPosition } from './camera.js';

// Создание сцены
const scene = new Scene();

// Создание рендерера
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Инициализация контроллеров
initializeControls(renderer.domElement);

// Создание куба
const geometry = new BoxGeometry(1, 1, 1); // Размеры куба
const material = new MeshBasicMaterial({ color: 0x00ff00 }); // Цвет куба
const cube = new Mesh(geometry, material); // Создание меша
scene.add(cube); // Добавление куба в сцену

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
