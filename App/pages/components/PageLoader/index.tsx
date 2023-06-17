import { Canvas } from '@react-three/fiber'
import React from 'react'
import { TextLoader } from '../TextLoader'

const PageLoader = () => {
  return (
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      position: [0, 1, 2.8],
    }}
    style={{ height: "100vh", cursor: "pointer" }}
  >
    <TextLoader />
  </Canvas>
  )
}

export default PageLoader