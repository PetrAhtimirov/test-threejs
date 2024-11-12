import * as THREE from "three";
import {getYPosition} from "../objects/ground.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {renderer} from "./renderer.js";

const distance = 400;
const FOV = 2 * Math.atan(window.innerHeight / (2 * distance)) * (180 / Math.PI);
export const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(-30, 10, 30);


// Управление камерой
export const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;
// Установка ограничений для управления камерой
controls.maxPolarAngle = Math.PI / 2;  // Не позволяет камере уйти ниже горизонта
controls.minPolarAngle = 0;            // Не позволяет камере смотреть вверх под землю

// Ограничиваем радиус для предотвращения выхода за границы земли
controls.minDistance = 5;             // Минимальное расстояние от центра (можно настроить под вашу сцену)
controls.maxDistance = 60;            // Максимальное расстояние от центра

// Функция, чтобы получить высоту рельефа в текущем положении камеры
const getTerrainHeightAtCameraPosition = (cameraPosition) => {
    const x = cameraPosition.x;
    const z = cameraPosition.z;
    return getYPosition(x, z);  // Используем вашу функцию для вычисления высоты
}

// Коррекция положения камеры, чтобы не уходила под землю
export const cameraCorrection = () => {
    const terrainHeight = getTerrainHeightAtCameraPosition(camera.position);
    const minCameraHeight = terrainHeight + 2; // Устанавливаем минимальную высоту камеры над рельефом
    if (camera.position.y < minCameraHeight) {
        camera.position.y = minCameraHeight;  // Если камера ниже рельефа, поднимаем её
    }
}


