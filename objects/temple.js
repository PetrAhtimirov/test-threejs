import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader, DoubleSide } from 'three';
import {scene} from "../main.js";
import mtlFilePath from '../models/japanese_temple/Japanese_Temple.mtl';
import textureFilePath from '../models/japanese_temple/Japanese_Temple_Paint2_Japanese_Shrine_Mat_AlbedoTransparency.png';
import objFilePath from '../models/japanese_temple/Japanese_Temple.obj'


export const initTemple = () => {
    // Создаем загрузчик текстуры
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(textureFilePath); // Укажите путь к текстуре

    // Загрузка материалов из .mtl файла
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlFilePath, function (materials) {
        materials.preload();

        // Устанавливаем текстуру для каждого материала
        for (const materialName in materials.materials) {
            const material = materials.materials[materialName];
            material.map = texture; // Применяем текстуру к материалу
            material.side = DoubleSide; // Чтобы текстура отображалась с обеих сторон
            material.needsUpdate = true;
        }

        // Загрузка объекта из .obj файла с примененными материалами
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(objFilePath, function (object) {
            const scale = 1.2;
            object.scale.set(scale, scale, scale)
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(object);
        });
    });
}