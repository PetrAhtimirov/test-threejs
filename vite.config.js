import { defineConfig } from 'vite';

export default defineConfig({
    base: '/test-threejs/',
    assetsInclude: ['**/*.glb', '**/*.mtl', '**/*.png', '**/*.obj'],
});
