import './style.css';
import * as THREE from 'three';
import {controls} from "./setup/camera.js";
import {stats} from "./setup/stats.js";
import {camera, cameraCorrection} from "./setup/camera.js";
import {renderer} from "./setup/renderer.js";
import {initLight} from "./setup/lights.js";
import {ground} from "./objects/ground.js";
import {grass, material} from "./objects/grass.js";
import {snow, snowAnimation} from "./objects/snow.js";
import {setupMenu} from "./setup/menu.js";
import {initTemple} from "./objects/temple.js";
import {Fog} from "three";
import {getBackgroundColor} from "./objects/daynight.js";

const loaderElement = document.querySelector('.loader_wrapper');

// Создаем менеджер загрузки
export const loadingManager = new THREE.LoadingManager(
    () => {
        // Добавляем класс "hidden" для плавного исчезновения
        loaderElement.classList.add('hidden');
        // Ждем завершения анимации перед началом рендера
        animate();
    },
    (url, itemsLoaded, itemsTotal) => {
    },
    (url) => {
        console.error(`Ошибка загрузки: ${url}`);
    }
);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

export const scene = new THREE.Scene();
scene.fog = new Fog(getBackgroundColor(), 24, 100);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initLight();

scene.add(ground);
scene.add(grass);
scene.add(snow);
scene.add(camera);
initTemple();

// Основной цикл рендера
let time = 0;
const animate = () => {
    stats.begin();
    time += 0.01;
    material.uniforms.time.value = time;
    snowAnimation();
    cameraCorrection();
    controls.update();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(animate);
};

setupMenu();
