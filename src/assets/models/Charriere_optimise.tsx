import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import {useControls}  from 'leva'
import fragment from '../shaders/TestShader/fragment.glsl'
import vertex from '../shaders/TestShader/vertex.glsl'

type GLTFResult = GLTF & {
  nodes: {
    chevet_parois: THREE.Mesh
    chevet_voutes: THREE.Mesh
    choeur_parois_nord: THREE.Mesh
    choeur_parois_sud: THREE.Mesh
    choeur_voutes: THREE.Mesh
  }
  materials: {
    chevet_parois: THREE.MeshBasicMaterial
    chevet_voutes: THREE.MeshBasicMaterial
    choeur_parois_nord: THREE.MeshBasicMaterial
    choeur_parois_sud: THREE.MeshBasicMaterial
    choeur_voutes: THREE.MeshBasicMaterial
  }
}


const MixMaterial = ({...MaterialProps}) => {
  const {geometry, material, name} = MaterialProps
  // material.map.encoding = THREE.sRGBEncoding

  const texParams = {
    path : "model",
    prefix : "baked",
    type : ["origine", "restitution"],
    resolution : "2K",
    suffixe : "jpg"
  }


/**
 ** Déclare les textures
 */

  const [uTextureOrigine, uTextureRestitution] = useTexture([`${texParams.path}/${texParams.prefix}_${name}_${texParams.type[0]}_${texParams.resolution}.${texParams.suffixe}`,
  `${texParams.path}/${texParams.prefix}_${name}_${texParams.type[1]}_${texParams.resolution}.${texParams.suffixe}`])

  function SetTexture(tex: THREE.Texture) {
    tex.flipY = false
    // tex.encoding = THREE.LinearEncoding
    tex.name = `${name}_tex`
    
    return tex
  }

 [uTextureOrigine, uTextureRestitution].map(tex => SetTexture(tex))



  const { mixFactor } = useControls({
    mixFactor : {
      label : 'restitution',
      value : 0,
      min : 0,
      max : 100,
      //suffix : "%"
    }
  })

  return (
    <mesh geometry={geometry} name={name}>
    <shaderMaterial 
      name={name}
      attach="material" 
      args={[{
        vertexShader : vertex,
        fragmentShader : fragment,
        uniforms: {
          uMixFactor : {value : mixFactor/100},
          uTextureOrigine : {value : uTextureOrigine},
          uTextureRestitution : {value : uTextureRestitution},
          uEmissive : {value : new THREE.Color('white')}
        },
        side : THREE.DoubleSide,
        toneMapped : true,
        transparent : true,
        depthWrite : true
      }]}
    />
  </mesh>
  )
}





export default function CharriereOptimise(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('model/charriere_optimise.gltf') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.chevet_parois.geometry} material={materials.chevet_parois} />
      <MixMaterial geometry={nodes.chevet_voutes.geometry} material={materials.chevet_voutes} name={nodes.chevet_voutes.name}/>
      <mesh geometry={nodes.choeur_parois_nord.geometry} material={materials.choeur_parois_nord} />
      <mesh geometry={nodes.choeur_parois_sud.geometry} material={materials.choeur_parois_sud} />
      <MixMaterial geometry={nodes.choeur_voutes.geometry} material={materials.choeur_voutes} name={nodes.choeur_voutes.name}/>
    </group>
  )
}

useGLTF.preload('/model/charriere_optimise.gltf')
