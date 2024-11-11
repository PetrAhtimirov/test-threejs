export const fragmentSource = `
    precision highp float;
    uniform sampler2D map, alphaMap;
    varying vec2 vUv;
    varying float vStretch;

    void main() {
    vec4 texColor = texture2D(map, vUv);
    // Умножаем текстуру на темный оттенок
    texColor.rgb *= 0.1;
    texColor.rgb += vec3(0.0, 0.08, 0.0);
    

    float alpha = texture2D(alphaMap, vUv).a;
    gl_FragColor = texColor;
    gl_FragColor.a *= alpha * vStretch;
}
`;