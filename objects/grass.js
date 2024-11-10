import {
    PlaneGeometry,
    InstancedBufferGeometry,
    InstancedBufferAttribute,
    TextureLoader,
    LinearMipMapLinearFilter,
    LinearFilter,
    RawShaderMaterial,
    Vector2,
    DoubleSide,
    Quaternion,
    Euler,
    Mesh
} from "three";
import {joints, instances, width, h_} from "../setup/config.js";
import {getYPosition} from "./ground.js";
import {vertexSource} from "../shaders/vertexShader.js";
import {fragmentSource} from "../shaders/fragmentShader.js";

// Параметры травинок
const bladeWidth = 0.17;
const bladeHeight = h_ * 1.5; // Увеличиваем высоту

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

const offsets = [], orientations = [], stretches = [];
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
}

// Добавляем атрибуты инстанса
instancedGeometry.setAttribute('offset', new InstancedBufferAttribute(new Float32Array(offsets), 3));
instancedGeometry.setAttribute('orientation', new InstancedBufferAttribute(new Float32Array(orientations), 4));
instancedGeometry.setAttribute('stretch', new InstancedBufferAttribute(new Float32Array(stretches), 1));

// Текстуры
const textureLoader = new TextureLoader();
const texture = textureLoader.load("https://res.cloudinary.com/al-ro/image/upload/v1552838655/v2_iqvzcx.png");
const alphaMap = textureLoader.load("https://res.cloudinary.com/al-ro/image/upload/v1552834315/Screen_Shot_2019-03-17_at_15.50.35_y5zfyu.png");

texture.generateMipmaps = true;
texture.minFilter = LinearMipMapLinearFilter;
texture.magFilter = LinearFilter;

alphaMap.generateMipmaps = true;
alphaMap.minFilter = LinearMipMapLinearFilter;
alphaMap.magFilter = LinearFilter;

export const material = new RawShaderMaterial({
    uniforms: {
        map: {value: texture},
        alphaMap: {value: alphaMap},
        time: {value: 0},
        windStrength: {value: 1.0}, // Уменьшили силу ветра
        windDirection: {value: new Vector2(1, 0)}
    },
    vertexShader: vertexSource,
    fragmentShader: fragmentSource,
    side: DoubleSide
});

// Создаем меш с инстансами травинок
export const grass = new Mesh(instancedGeometry, material);
grass.castShadow = true;  // Травинки отбрасывают тени
grass.receiveShadow = true;  // Травинки могут принимать тени