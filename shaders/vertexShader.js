export const vertexSource = `
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