varying vec2 vUv;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float mixFactor;
void main() {
    vec4 _texture1 = texture2D(texture1, vUv);
    vec4 _texture2 = texture2D(texture2, vUv);
    vec4 finalTexture = mix(_texture1, _texture2, mixFactor);
    gl_FragColor = finalTexture;
}