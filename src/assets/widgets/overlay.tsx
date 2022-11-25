import * as THREE from 'three'
import React, { useRef } from 'react'

const Overlay = () => {
    const vertex =
    `
    void main()
    {
        gl_Position = vec4(position, 1.0);
    }
    `

    const fragment = 
    `
    uniform float uAlpha;
    void main()
    {
        gl_FragColor = vec4(0.1, 0.1, 0.1, uAlpha);
    }
    `

    return (
        <mesh>
            <planeBufferGeometry args={[2,2,1,1]} />

            <shaderMaterial 
            name="Overlay"
            attach="material" 
            args={[{
                vertexShader : vertex,
                fragmentShader : fragment,
                uniforms : {
                    uAlpha : {value : 0.25}
                },
                transparent : true,
                wireframe : false
            }]}
            />
      </mesh>
    )
}
export default Overlay