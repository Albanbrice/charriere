import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import {useControls}  from 'leva'
import { GLTF } from 'three-stdlib'
import fragment from '../shaders/TestShader/fragment.glsl'
import vertex from '../shaders/TestShader/vertex.glsl'
import { Light } from 'three'



type GLTFResult = GLTF & {
  nodes: {
    chevet_parois: THREE.Mesh
    chevet_voutes: THREE.Mesh
    choeur_parois_nord: THREE.Mesh
    choeur_parois_sud: THREE.Mesh
    choeur_voutes: THREE.Mesh
  }
  materials: {
    chevet_parois: THREE.MeshStandardMaterial
    chevet_voutes: THREE.MeshStandardMaterial
    choeur_parois_nord: THREE.MeshStandardMaterial
    choeur_parois_sud: THREE.MeshStandardMaterial
    choeur_voutes: THREE.MeshStandardMaterial
  }
}


const MixMeshStandardMaterial = new THREE.MeshStandardMaterial({

})

const SetMeshStandardMaterial = ({...MaterialProps})=> {
  const {geometry, material, name} = MaterialProps
  material.map.encoding = THREE.sRGBEncoding  

  const transparence = 1
  const wireframe = false

  // const { transparence, wireframe } = useControls({
    
  //   transparence : {
  //     value : 1,
  //     min : 0,
  //     max : 1
  //   },
  //   wireframe : {
  //     value : false
  //   }
  // })
  
  return (
    <mesh geometry={geometry} name={name}>
      <meshStandardMaterial {...material} transparent opacity={transparence} wireframe={wireframe} color="grey"/>
    </mesh>
  )
}


const MixMaterial = ({...MaterialProps}) => {
  const {geometry, material, name} = MaterialProps
  material.map.encoding = THREE.sRGBEncoding 

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
    tex.encoding = THREE.sRGBEncoding
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
        toneMapped : true        
      }]}
    />
  </mesh>
  )
}


export default function Charriere(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('model/charriere.gltf') as GLTFResult
  
  return (
    <group {...props} dispose={null} name="Charriere">
      <SetMeshStandardMaterial name={nodes.chevet_parois.name} geometry={nodes.chevet_parois.geometry} material={materials.chevet_parois} />
      <MixMaterial name={nodes.chevet_voutes.name} geometry={nodes.chevet_voutes.geometry} material={materials.chevet_voutes} />
      <SetMeshStandardMaterial name={nodes.choeur_parois_nord.name} geometry={nodes.choeur_parois_nord.geometry} material={materials.choeur_parois_nord} />
      <SetMeshStandardMaterial name={nodes.choeur_parois_sud.name} geometry={nodes.choeur_parois_sud.geometry} material={materials.choeur_parois_sud} />
      <MixMaterial name={nodes.choeur_voutes.name} geometry={nodes.choeur_voutes.geometry} material={materials.choeur_voutes} />
    </group>
  )
}

useGLTF.preload('model/charriere.gltf')
