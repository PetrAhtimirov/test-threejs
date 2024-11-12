import { scene } from "../main.js";
import { renderer } from "../renderer.js";
import { material } from "./grass.js";
import { Color } from "three";

// Изначальный цвет фона
let backgroundColor = new Color(0x010017);

// Функция для изменения цвета фона
export const setBackgroundColor = (newColor) => {
    backgroundColor.set(newColor);  // Обновляем цвет фона

    // Обновляем фон сцены
    scene.background = backgroundColor;
    renderer.setClearColor(backgroundColor, 1);

    // Обновляем туман
    if (scene.fog) {
        scene.fog.color.set(newColor);
    }

    // Обновляем цвет тумана в материале травы
    updateGrassFogColor(newColor);
};

// Функция для обновления цвета тумана в траве
const updateGrassFogColor = (newColor) => {
    if (material) {
        // Создаём объект `Color` на основе `newColor`
        const darkerFogColor = new Color(newColor);

        // Уменьшаем яркость на 10%
        darkerFogColor.offsetHSL(0, 0, -0.1);

        // Устанавливаем темный цвет тумана для травы
        material.uniforms.fogColor.value.set(darkerFogColor);
    }
}

export const getBackgroundColor = () => {
    return backgroundColor;
};
