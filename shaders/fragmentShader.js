export const fragmentSource = `
    precision highp float;
    
    uniform vec3 lightDirection; // Направление света
    uniform vec3 lightColor;     // Цвет света
    uniform vec3 fogColor;       // Цвет тумана
    uniform float fogNear;       // Начало тумана
    uniform float fogFar;        // Конец тумана
    
    varying vec2 vUv;
    varying float vStretch;
    varying vec3 vColor;
    varying vec3 vNormal;
    varying float vFogDepth;
    
    void main() {
        // Нормализуем нормаль и направление света
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(lightDirection);
    
        // Расчет диффузного освещения
        float diff = max(dot(normal, lightDir), 0.0);
    
        // Базовый цвет травы с учетом освещения
        vec3 color = vColor * (0.3 + 0.7 * diff) * lightColor;
    
        // Расчет тумана (линейный туман)
        float fogFactor = (vFogDepth - fogNear) / (fogFar - fogNear);
        fogFactor = clamp(fogFactor, 0.0, 1.0);
    
        // Микшируем цвет травы с цветом тумана
        vec3 finalColor = mix(color, fogColor, fogFactor);
    
        // Устанавливаем итоговый цвет с альфа-каналом
        gl_FragColor = vec4(finalColor, 1.0);
        gl_FragColor.a *= vStretch;
    }
`;