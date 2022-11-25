precision mediump float;
uniform float uMixFactor;
uniform sampler2D uTextureOrigine;
uniform sampler2D uTextureRestitution;
uniform vec3 uEmissive;
varying vec2 vUv;

void main()
{
    vec4 textureOrigine = texture2D(uTextureOrigine, vUv);
    vec4 textureRestitution = texture2D(uTextureRestitution, vUv);
    vec4 relight = vec4(uEmissive, 1.0);
    vec4 mixTexture = mix(textureOrigine, textureRestitution, uMixFactor);
    gl_FragColor = mixTexture;
    // mixTexture *
    // gl_FragColor = vec4(1.0, uMixFactor, 0.0, 1.0);
}