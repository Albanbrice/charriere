import { Canvas, useThree } from '@react-three/fiber'
import {useRef, Suspense} from 'react'
import { OrbitControls, PerspectiveCamera, Billboard, Text, Plane, Loader } from '@react-three/drei'
import { Interactive, XR, Controllers, VRButton, ARButton } from '@react-three/xr'
import type {Camera} from 'three'
// import { VRButton } from 'three/addons/webxr/VRButton.js';
import {useControls}  from 'leva'

import Charriere from './assets/models/Charriere'
import CharriereOptimise from './assets/models/Charriere_optimise'

import Overlay from './assets/widgets/overlay'


import './App.css'



function ThreeScene() {

  return (
    <>
      <VRButton />
      <Canvas camera={{position : [-5,4,0.5]}}>
        <XR>
          {/* <Overlay /> */}
          <PerspectiveCamera />
          <OrbitControls 
            target={[0,4,0.5]}  
          />
          
          <Suspense fallback={<Overlay />}>

            <CharriereOptimise />      

          </Suspense>
          {/* <Billboard
              follow={true}
              lockX={false}
              lockY={false}
              lockZ={false} // Lock the rotation on the z axis (default=false)
          >
            <Plane args={[3,2]} position={[0,4,0]}/>
            <Text fontSize={1}>I'm a billboard</Text>
          </Billboard> */}
        </XR>



        </Canvas>
    </>


  )
}

function App() {
  return (
    <div className="App h-screen bg-[#1e1e1e]">
      <ThreeScene />
      <Loader />
    </div>
  )
}

export default App
