import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import { createNoise2D } from 'simplex-noise';

const canvas = document.getElementById("canvas");

const isMobile = /Android|webOS|iPhone|BlackBerry|Windows Phone/i.test(navigator.userAgent);

// Параметры травинок
const joints = 5, width = isMobile ? 50 : 120, instances = isMobile ? 15000 : 75000;
const w_ = 0.12, h_ = 1;

// Настройки камеры
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x010017, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const distance = 400;
const FOV = 2 * Math.atan(window.innerHeight / (2 * distance)) * (180 / Math.PI);
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(-50, 10, 50);
scene.add(camera);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Основной источник света
const centerLight = new THREE.PointLight(0xffffff, 2, 100, 2);
centerLight.position.set(0, 10, 0);
centerLight.castShadow = true;  // Включаем тени для этого света
scene.add(centerLight);
centerLight.intensity = 3;

// Дополнительное освещение
const ambientLight = new THREE.AmbientLight(0x222222, 1); // Темный фоновый свет
scene.add(ambientLight);

// Управление камерой
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;
// Установка ограничений для управления камерой
controls.maxPolarAngle = Math.PI / 2;  // Не позволяет камере уйти ниже горизонта
controls.minPolarAngle = 0;            // Не позволяет камере смотреть вверх под землю

// Ограничиваем радиус для предотвращения выхода за границы земли
controls.minDistance = 5;             // Минимальное расстояние от центра (можно настроить под вашу сцену)
controls.maxDistance = 60;            // Максимальное расстояние от центра

// Панель статистики
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Функция шума для ландшафта
const noise2D = createNoise2D();
const getYPosition = (x, z) => {
    return 2 * noise2D(x / 50, z / 50) + 4 * noise2D(x / 100, z / 100) + 0.2 * noise2D(x / 10, z / 10);
};

// Ландшафт
const groundGeometry = new THREE.PlaneGeometry(width, width, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x0F4D0F });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.castShadow = true;  // Отбрасывает тени
ground.receiveShadow = true;  // Принимает тени

groundGeometry.attributes.position.array.forEach((_, i) => {
    const x = groundGeometry.attributes.position.getX(i);
    const z = groundGeometry.attributes.position.getZ(i);
    groundGeometry.attributes.position.setY(i, getYPosition(x, z));
});
groundGeometry.attributes.position.needsUpdate = true;
groundGeometry.computeVertexNormals();
scene.add(ground);

// Параметры травинок
const bladeWidth = 0.17;
const bladeHeight = h_ * 1.5; // Увеличиваем высоту

const baseGeometry = new THREE.PlaneGeometry(bladeWidth, bladeHeight, 1, joints);
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

const instancedGeometry = new THREE.InstancedBufferGeometry();
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
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(0, angleY, 0));

    orientations.push(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
}

// Добавляем атрибуты инстанса
instancedGeometry.setAttribute('offset', new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3));
instancedGeometry.setAttribute('orientation', new THREE.InstancedBufferAttribute(new Float32Array(orientations), 4));
instancedGeometry.setAttribute('stretch', new THREE.InstancedBufferAttribute(new Float32Array(stretches), 1));

// Текстуры
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("https://res.cloudinary.com/al-ro/image/upload/v1552838655/v2_iqvzcx.png");
const alphaMap = textureLoader.load("https://res.cloudinary.com/al-ro/image/upload/v1552834315/Screen_Shot_2019-03-17_at_15.50.35_y5zfyu.png");

texture.generateMipmaps = true;
texture.minFilter = THREE.LinearMipMapLinearFilter;
texture.magFilter = THREE.LinearFilter;

alphaMap.generateMipmaps = true;
alphaMap.minFilter = THREE.LinearMipMapLinearFilter;
alphaMap.magFilter = THREE.LinearFilter;

const vertexSource = `
    precision highp float;
    attribute vec3 position, offset;
    attribute vec2 uv;
    attribute float stretch;
    attribute vec4 orientation;
    uniform mat4 modelViewMatrix, projectionMatrix;
    uniform float time;
    uniform float windStrength;
    uniform vec2 windDirection;
    varying float vStretch;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vStretch = stretch;

        // Вращение травинки
        vec3 pos = position;
        float angle = 2.0 * acos(orientation.w);
        vec3 axis = normalize(vec3(orientation.x, orientation.y, orientation.z));
        mat4 rotationMatrix = mat4(
            cos(angle) + axis.x * axis.x * (1.0 - cos(angle)),
            axis.x * axis.y * (1.0 - cos(angle)) - axis.z * sin(angle),
            axis.x * axis.z * (1.0 - cos(angle)) + axis.y * sin(angle),
            0.0,
            
            axis.y * axis.x * (1.0 - cos(angle)) + axis.z * sin(angle),
            cos(angle) + axis.y * axis.y * (1.0 - cos(angle)),
            axis.y * axis.z * (1.0 - cos(angle)) - axis.x * sin(angle),
            0.0,
            
            axis.z * axis.x * (1.0 - cos(angle)) - axis.y * sin(angle),
            axis.z * axis.y * (1.0 - cos(angle)) + axis.x * sin(angle),
            cos(angle) + axis.z * axis.z * (1.0 - cos(angle)),
            0.0,
            
            0.0, 0.0, 0.0, 1.0
        );
        
        pos = (rotationMatrix * vec4(pos, 1.0)).xyz;

        // Эффект ветра, ослабленный для уменьшения наклона
        float windEffect = sin((offset.x + offset.z) * 0.1 + time * windStrength) * windStrength * 0.3; // Ослабленный эффект ветра
        float influence = position.y; // Увеличение влияния ветра к верхушке
        pos.x += windEffect * windDirection.x * influence;
        pos.z += windEffect * windDirection.y * influence;

        pos.y *= stretch;
        pos += offset;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;




const fragmentSource = `
    precision highp float;
    uniform sampler2D map, alphaMap;
    varying vec2 vUv;
    varying float vStretch;

    void main() {
    vec4 texColor = texture2D(map, vUv);
    // Умножаем текстуру на темный оттенок
    texColor.rgb *= 0.1;
    texColor.rgb += vec3(0.0, 0.1, 0.0);
    

    float alpha = texture2D(alphaMap, vUv).a;
    gl_FragColor = texColor;
    gl_FragColor.a *= alpha * vStretch;
}
`;

const material = new THREE.RawShaderMaterial({
    uniforms: {
        map: { value: texture },
        alphaMap: { value: alphaMap },
        time: { value: 0 },
        windStrength: { value: 1.0 }, // Уменьшили силу ветра
        windDirection: { value: new THREE.Vector2(1, 0) }
    },
    vertexShader: vertexSource,
    fragmentShader: fragmentSource,
    side: THREE.DoubleSide
});

// Создаем меш с инстансами травинок
const grass = new THREE.Mesh(instancedGeometry, material);
grass.castShadow = true;  // Травинки отбрасывают тени
grass.receiveShadow = true;  // Травинки могут принимать тени
scene.add(grass);

// Основной цикл рендера
let time = 0;
const animate = () => {
    stats.begin();
    time += 0.01;
    material.uniforms.time.value = time;
    controls.update();
    renderer.render(scene, camera);
    stats.end();

    requestAnimationFrame(animate);
};

animate();
