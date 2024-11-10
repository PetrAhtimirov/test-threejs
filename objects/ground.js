import { createNoise2D } from 'simplex-noise';
import {PlaneGeometry, MeshPhongMaterial, Mesh} from "three";
import {width} from "../setup/config.js";

// Функция шума для ландшафта
const noise2D = createNoise2D();
export const getYPosition = (x, z) => {
    return 2 * noise2D(x / 50, z / 50) + 4 * noise2D(x / 100, z / 100) + 0.2 * noise2D(x / 10, z / 10);
};

// Ландшафт
const groundGeometry = new PlaneGeometry(width, width, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new MeshPhongMaterial({ color: 0x0F4D0F });
export const ground = new Mesh(groundGeometry, groundMaterial);
ground.castShadow = true;  // Отбрасывает тени
ground.receiveShadow = true;  // Принимает тени

groundGeometry.attributes.position.array.forEach((_, i) => {
    const x = groundGeometry.attributes.position.getX(i);
    const z = groundGeometry.attributes.position.getZ(i);
    groundGeometry.attributes.position.setY(i, getYPosition(x, z));
});
groundGeometry.attributes.position.needsUpdate = true;
groundGeometry.computeVertexNormals();