import { defineConfig } from 'vite';

export default defineConfig({
    base: '/test-threejs/', // Замените на имя вашего репозитория
    assetsInclude: ['**/*.glb'], // Убедитесь, что .glb файлы включены
});