export const fragmentSource = `
    precision highp float;
    uniform vec3 lightDirection; // Направление света
    uniform vec3 lightColor; // Цвет света
    varying vec2 vUv;
    varying float vStretch;
    varying vec3 vColor;
    varying vec3 vNormal;
    
    void main() {
        // Нормализуем нормаль и направление света
        vec3 normal = normalize(vNormal);
        vec3 lightDir = normalize(lightDirection);
    
        // Расчет затенения на основе косинуса угла между нормалью и направлением света
        float diff = max(dot(normal, lightDir), 0.0);
    
        // Базовый цвет травы
        vec3 color = vColor * 0.4 + vec3(0.0, 0.5, 0.0); // Темный зеленый оттенок
        
        // Освещенность
        vec3 litColor = color * (0.3 + 0.7 * diff) * lightColor;
    
        // Устанавливаем конечный цвет
        gl_FragColor = vec4(litColor, 1.0);
        gl_FragColor.a *= vStretch;
    }
`;