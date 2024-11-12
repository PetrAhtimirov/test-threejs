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
import {joints, instances, width, h_} from "../setup/config.js";
import {getYPosition} from "./ground.js";
import {vertexSource} from "../shaders/vertexShader.js";
import {fragmentSource} from "../shaders/fragmentShader.js";

// Параметры травинок
const bladeWidth = 0.17;
const bladeHeight = h_ * 1.5;

const baseGeometry = new PlaneGeometry(bladeWidth, bladeHeight, 1, joints);
baseGeometry.translate(0, bladeHeight / 2, 0);

const positions = baseGeometry.attributes.position.array;
for (let i = 0; i < positions.length; i += 3) {
    const y = positions[i + 1];
    const curveFactor = (y / bladeHeight);
    const taperFactor = 1 - curveFactor * curveFactor;

    positions[i] *= taperFactor;
    positions[i] += curveFactor * 0.05;
}
baseGeometry.attributes.position.needsUpdate = true;

const instancedGeometry = new InstancedBufferGeometry();
instancedGeometry.index = baseGeometry.index;
instancedGeometry.attributes.position = baseGeometry.attributes.position;
instancedGeometry.attributes.uv = baseGeometry.attributes.uv;

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

    // Добавляем случайный зелёный цвет для каждой травинки
    const greenShade = 0.5 + Math.random() * 0.5;  // Значения от 0.5 до 1.0 для оттенка зелёного
    colors.push(0, greenShade, 0);  // Красный = 0, зелёный варьируется, синий = 0
}

// Добавляем атрибуты инстанса
instancedGeometry.setAttribute('offset', new InstancedBufferAttribute(new Float32Array(offsets), 3));
instancedGeometry.setAttribute('orientation', new InstancedBufferAttribute(new Float32Array(orientations), 4));
instancedGeometry.setAttribute('stretch', new InstancedBufferAttribute(new Float32Array(stretches), 1));
instancedGeometry.setAttribute('color', new InstancedBufferAttribute(new Float32Array(colors), 3)); // Атрибут цвета

export const material = new RawShaderMaterial({
    uniforms: {
        time: {value: 0},
        windStrength: {value: 1.0},
        windDirection: {value: new Vector2(1, 0)},
        lightDirection: {value: new Vector3(0.5, 1.0, 0.5).normalize()}, // Направление света
        lightColor: {value: new Color(0.1, 0.1, 0.1)}, // Цвет света
    },
    vertexShader: vertexSource,
    fragmentShader: fragmentSource,
    side: DoubleSide
});

// Создаем меш с инстансами травинок
export const grass = new Mesh(instancedGeometry, material);
grass.castShadow = true;
grass.receiveShadow = true;
