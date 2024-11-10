import {AmbientLight, PointLight} from "three";

export const centerLight = new PointLight(0xffffff, 2, 100, 2);
centerLight.position.set(0, 10, 0);
centerLight.castShadow = true;  // Включаем тени для этого света
centerLight.intensity = 3;

// Дополнительное освещение
export const ambientLight = new AmbientLight(0x222222, 1); // Темный фоновый свет