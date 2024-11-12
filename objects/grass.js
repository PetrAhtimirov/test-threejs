import {
    PlaneGeometry,
    InstancedBufferGeometry,
    InstancedBufferAttribute,
    RawShaderMaterial,
    DoubleSide,
    Quaternion,
    Euler,
    Mesh,
    Vector2,
    Vector3,
    Color
} from "three";
import { joints, instances, width, h_ } from "../setup/config.js";
import { getYPosition } from "./ground.js";
import { vertexSource } from "../shaders/vertexShader.js";
import { fragmentSource } from "../shaders/fragmentShader.js";

// Параметры травинок
const bladeWidth = 0.17;
const bladeHeight = h_ * 1.5;

const baseGeometry = new PlaneGeometry(bladeWidth, bladeHeight, 1, joints);
baseGeometry.translate(0, bladeHeight / 2, 0);

// Модификация формы травинки
const positions = baseGeometry.attributes.position.array;
for (let i = 0; i < positions.length; i += 3) {
    const y = positions[i + 1];
    const curveFactor = y / bladeHeight;
    const taperFactor = 1.0 - curveFactor * curveFactor;

    positions[i] *= taperFactor;
    positions[i] += curveFactor * 0.05;
}
baseGeometry.attributes.position.needsUpdate = true;

const instancedGeometry = new InstancedBufferGeometry();
instancedGeometry.index = baseGeometry.index;
instancedGeometry.attributes.position = baseGeometry.attributes.position;
instancedGeometry.attributes.uv = baseGeometry.attributes.uv;

// Массивы для инстансинга
const offsets = [], orientations = [], stretches = [], colors = [];
for (let i = 0; i < instances; i++) {
    const x = Math.random() * width - width / 2;
    const z = Math.random() * width - width / 2;
    const y = getYPosition(x, z);
    offsets.push(x, y, z);

    const stretch = Math.random() * (i < instances / 3 ? 1.8 : 1.0);
    stretches.push(stretch);

    const angleY = Math.random() * Math.PI * 2;
    const quaternion = new Quaternion();
    quaternion.setFromEuler(new Euler(0, angleY, 0));

    orientations.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

    // Используем более тёмные оттенки зелёного
    const greenShade = 0.2 + Math.random() * 0.2;  // Значения от 0.2 до 0.4 для тёмно-зелёного
    colors.push(0, greenShade, 0);  // Красный = 0, зелёный = greenShade, синий = 0
}

// Добавляем атрибуты инстанса
instancedGeometry.setAttribute('offset', new InstancedBufferAttribute(new Float32Array(offsets), 3));
instancedGeometry.setAttribute('orientation', new InstancedBufferAttribute(new Float32Array(orientations), 4));
instancedGeometry.setAttribute('stretch', new InstancedBufferAttribute(new Float32Array(stretches), 1));
instancedGeometry.setAttribute('color', new InstancedBufferAttribute(new Float32Array(colors), 3)); // Атрибут цвета

// Устанавливаем изначальный цвет тумана (0x010017)
const fogColor = new Color(0x010017);
const fogNear = 10.0;
const fogFar = 100.0;

// Определяем направление и цвет света
const lightDirection = new Vector3(0.5, 1.0, 0.5).normalize();
const lightColor = new Color(0.8, 0.8, 0.8); // Белый свет

export const material = new RawShaderMaterial({
    uniforms: {
        time: { value: 0 },
        windStrength: { value: 1.0 },
        windDirection: { value: new Vector2(1, 0) },
        lightDirection: { value: lightDirection },
        lightColor: { value: lightColor },
        fogColor: { value: fogColor },
        fogNear: { value: fogNear },
        fogFar: { value: fogFar }
    },
    vertexShader: vertexSource,
    fragmentShader: fragmentSource,
    side: DoubleSide
});

// Создаем меш с инстансами травинок
export const grass = new Mesh(instancedGeometry, material);
grass.castShadow = true;
grass.receiveShadow = true;
