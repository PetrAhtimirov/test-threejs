import { createNoise2D } from 'simplex-noise';
import {PlaneGeometry, MeshPhongMaterial, Mesh} from "three";
import {width} from "../setup/config.js";
import {flatSurfaceWidth} from "../setup/config.js";

export let minGroundY = 0;
export let maxGroundY = 0;

// Функция шума для ландшафта
const noise2D = createNoise2D();
export const getYPosition = (x, z) => {
    const distanceFromCenter = Math.sqrt(x * x + z * z);

    // Если точка находится в пределах 20 единиц от центра, делаем высоту 0
    if (distanceFromCenter <= flatSurfaceWidth/2) {
        return 0;
    }

    // В противном случае используем функцию шума для создания рельефа
    const smoothFactor = (distanceFromCenter - 20) / 20;  // Плавный переход от 0 до 1
    const noiseValue = 2 * noise2D(x / 50, z / 50) + 4 * noise2D(x / 100, z / 100) + 0.2 * noise2D(x / 10, z / 10);

    // Интерполяция: ближе к центру высота ближе к 0, дальше - ближе к значению функции шума
    const value = noiseValue * smoothFactor;

    minGroundY = Math.min(minGroundY, value);
    maxGroundY = Math.max(maxGroundY, value);

    return value;
};


// Ландшафт
const groundGeometry = new PlaneGeometry(width, width, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new MeshPhongMaterial({ color: 0x223622 });
export const ground = new Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;  // Принимает тени

groundGeometry.attributes.position.array.forEach((_, i) => {
    const x = groundGeometry.attributes.position.getX(i);
    const z = groundGeometry.attributes.position.getZ(i);
    groundGeometry.attributes.position.setY(i, getYPosition(x, z));
});
groundGeometry.attributes.position.needsUpdate = true;
groundGeometry.computeVertexNormals();