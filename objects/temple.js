import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader, DoubleSide } from 'three';
import { scene } from "../main.js";
import mtlFilePath from '../models/japanese_temple/Japanese_Temple.mtl';
import textureFilePath from '../models/japanese_temple/Japanese_Temple_Paint2_Japanese_Shrine_Mat_AlbedoTransparency.png';
import objFilePath from '../models/japanese_temple/Japanese_Temple.obj';

export const initTemple = () => {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(textureFilePath);

    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlFilePath, function (materials) {
        materials.preload();

        for (const materialName in materials.materials) {
            const material = materials.materials[materialName];
            material.map = texture;
            material.side = DoubleSide;
            material.needsUpdate = true;
        }

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(objFilePath, function (object) {
            const scale = 1.2;
            object.scale.set(scale, scale, scale);

            const modelYPosition = 0;
            object.position.set(0, modelYPosition, 0);

            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(object);
        });
    });
};
