import {AmbientLight, PointLight, DirectionalLight, SpotLight} from "three";
import {scene} from "../main.js";

const centerLight1 = new PointLight(0xe3905f, 100, 14, 1);
centerLight1.position.set(10, 14, 10);

const centerLight2 = new PointLight(0xe3905f, 100, 14, 1);
centerLight2.position.set(-10, 14, -10);

const centerLight3 = new PointLight(0xe3905f, 100, 14, 1);
centerLight3.position.set(-10, 14, 10);

const centerLight4 = new PointLight(0xe3905f, 100, 14, 1);
centerLight4.position.set(10, 14, -10);

const ambientLight = new AmbientLight(0x222222, 1);

const directionalLight1 = new DirectionalLight(0xffffff, 0.2);
directionalLight1.position.set(15, 20, 15);
directionalLight1.castShadow = true;
directionalLight1.target.position.set(0, 0, 0);

const directionalLight2 = new DirectionalLight(0xffffff, 0.2);
directionalLight2.position.set(-15, 20, -15);
directionalLight2.castShadow = true;
directionalLight2.target.position.set(0, 0, 0);

export const initLight = () => {
    scene.add(centerLight1);
    scene.add(centerLight2);
    scene.add(centerLight3);
    scene.add(centerLight4);
    scene.add(ambientLight);
    scene.add(directionalLight1);
    scene.add(directionalLight2);
}