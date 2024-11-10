import {width} from "../setup/config.js";
import {PointsMaterial, BufferGeometry, Float32BufferAttribute, Points} from "three";
// Параметры для снега
const snowCount = 3000; // Количество снежинок
const snowSpeed = 0.02; // Скорость падения снежинок

// Создаем геометрию и материал для снежинок
const snowGeometry = new BufferGeometry();
const snowMaterial = new PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
    opacity: 0.8
});

// Устанавливаем позиции для снежинок
const snowPositions = [];
for (let i = 0; i < snowCount; i++) {
    const x = Math.random() * width - width / 2;
    const y = Math.random() * 100;
    const z = Math.random() * width - width / 2;
    snowPositions.push(x, y, z);
}
snowGeometry.setAttribute('position', new Float32BufferAttribute(snowPositions, 3));

// Создаем объект Points для снежинок и добавляем его в сцену
export const snow = new Points(snowGeometry, snowMaterial);

export const snowAnimation = () => {
    // Обновляем позиции снежинок
    const positions = snowGeometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= snowSpeed; // Опускаем снежинку по Y
        if (positions[i] < 0) positions[i] = 10; // Сбрасываем снежинку наверх, если она достигла земли
    }
    snowGeometry.attributes.position.needsUpdate = true;
}