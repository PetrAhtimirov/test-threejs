import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const targetPosition = camera.position.clone();
let controls;

export function setDefaultCameraPosition() {
    camera.position.set(0, 1, 5);
    camera.rotation.x = 0.2;
}
setDefaultCameraPosition();

export function initializeControls(rendererDomElement) {
    controls = new OrbitControls(camera, rendererDomElement);
    controls.enableDamping = true; // Включение демпфирования
    controls.dampingFactor = 0.25; // Фактор демпфирования
    controls.screenSpacePanning = false; // Запрет панорамирования в пространстве экрана
    controls.maxPolarAngle = Math.PI / 2; // Ограничение по углу вращения
    controls.minDistance = 2; // Минимальное расстояние
    controls.maxDistance = 10;
}

export function handleKeyPressCamera(event) {
    const key = event.key;

    switch (key) {
        case "+":
        case "=":
            targetPosition.z -= 0.1;
            break;
        case "-":
            targetPosition.z += 0.1;
            break;
        case "w":
            targetPosition.y += 0.1;
            break;
        case "s":
            targetPosition.y -= 0.1;
            break;
        case "a":
            targetPosition.x -= 0.1;
            break;
        case "d":
            targetPosition.x += 0.1;
            break;
    }
}

export function updateCameraPosition() {
    camera.position.lerp(targetPosition, 0.1);
    if (controls) {
        controls.update();
    }
}
updateCameraPosition();