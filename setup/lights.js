import {AmbientLight, PointLight, DirectionalLight} from "three";
import {scene} from "../main.js";

const centerLight = new PointLight(0xe3905f, 2, 25, 0.7);
centerLight.position.set(15, 20, 15);
centerLight.castShadow = true;  // Включаем тени для этого света
centerLight.intensity = 100;

const directionalLight = new DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-15, 20, -15); // Устанавливаем позицию света
directionalLight.target.position.set(0, 0, 0); // Устанавливаем цель света


// Дополнительное освещение
const ambientLight = new AmbientLight(0x222222, 1); // Темный фоновый свет

export const initLight = () => {
    scene.add(centerLight);
    scene.add(ambientLight);
    scene.add(directionalLight);
}