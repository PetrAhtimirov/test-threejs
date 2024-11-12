import {AmbientLight, PointLight, DirectionalLight, SpotLight, HemisphereLight} from "three";
import {scene} from "../main.js";

const centerLight1 = new PointLight(0xe3905f, 100, 14, 1);
centerLight1.position.set(10, 14, 10);

const centerLight2 = new PointLight(0xe3905f, 100, 14, 1);
centerLight2.position.set(-10, 14, -10);

const centerLight3 = new PointLight(0xe3905f, 100, 14, 1);
centerLight3.position.set(-10, 14, 10);

const centerLight4 = new PointLight(0xe3905f, 100, 14, 1);
centerLight4.position.set(10, 14, -10);

const centerLight5 = new PointLight(0xe3905f, 30, 12, 1);
centerLight5.position.set(6, 26, 6);

const centerLight6 = new PointLight(0xe3905f, 30, 12, 1);
centerLight6.position.set(-6, 26, -6);

const centerLight7 = new PointLight(0xe3905f, 30, 12, 1);
centerLight7.position.set(-6, 26, 6);

const centerLight8 = new PointLight(0xe3905f, 30, 12, 1);
centerLight8.position.set(6, 26, -6);

const ambientLight = new AmbientLight(0x222222, 1);

const directionalLight1 = new DirectionalLight(0xffffff, 0.2);
directionalLight1.position.set(15, 20, 15);
directionalLight1.castShadow = true;
directionalLight1.target.position.set(0, 0, 0);

const directionalLight2 = new DirectionalLight(0xffffff, 0.2);
directionalLight2.position.set(-15, 20, -15);
directionalLight2.castShadow = true;
directionalLight2.target.position.set(0, 0, 0);

const dayLight = new HemisphereLight( 0xDCDCDC, 0x080820, 0.8 );

const directionalLight3 = new DirectionalLight(0xFDF4E3, 2);
directionalLight3.position.set(5, 40, 5);
directionalLight3.target.position.set(0, 0, 0);

const directionalLight4 = new DirectionalLight(0xFDF4E3, 2);
directionalLight4.position.set(-5, 40, -5);
directionalLight4.target.position.set(0, 0, 0);



export const initLight = () => {
    scene.add(centerLight1);
    scene.add(centerLight2);
    scene.add(centerLight3);
    scene.add(centerLight4);
    scene.add(centerLight5);
    scene.add(centerLight6);
    scene.add(centerLight7);
    scene.add(centerLight8);
    scene.add(ambientLight);
    scene.add(directionalLight1);
    scene.add(directionalLight2);
}

export const setNightLight = () => {
    scene.add(centerLight1);
    scene.add(centerLight2);
    scene.add(centerLight3);
    scene.add(centerLight4);
    scene.add(centerLight5);
    scene.add(centerLight6);
    scene.add(centerLight7);
    scene.add(centerLight8);
    scene.add(ambientLight);
    scene.remove(dayLight);
    scene.remove(directionalLight3);
    scene.remove(directionalLight4);
}

export const setDayLight = () => {
    scene.remove(centerLight1);
    scene.remove(centerLight2);
    scene.remove(centerLight3);
    scene.remove(centerLight4);
    scene.remove(centerLight5);
    scene.remove(centerLight6);
    scene.remove(centerLight7);
    scene.remove(centerLight8);
    scene.remove(ambientLight);
    scene.add(dayLight);
    scene.add(directionalLight3);
    scene.add(directionalLight4);
}