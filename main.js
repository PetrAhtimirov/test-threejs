import './style.css';
import * as THREE from 'three';
import {controls} from "./setup/camera.js";
import Stats from 'stats.js';
import {camera, cameraCorrection} from "./setup/camera.js";
import {renderer} from "./renderer.js";
import {ambientLight, centerLight} from "./setup/lights.js";
import {ground} from "./objects/ground.js";
import {grass, material} from "./objects/grass.js";
import {snow, snowAnimation} from "./objects/snow.js";

const scene = new THREE.Scene();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

scene.add(centerLight);
scene.add(ambientLight);

// Панель статистики
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

scene.add(ground);

scene.add(grass);

scene.add(snow);

scene.add(camera);


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

animate();
