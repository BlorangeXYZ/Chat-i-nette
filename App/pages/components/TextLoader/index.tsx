import React, { useRef, useState } from "react";
import { Text3D, OrbitControls, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export const TextLoader = () => {
  const refText = useRef<Text3D>();

  const [rotationSpeed] = useState(0.53); // slower rotation
  const [rotationDirection] = useState({ x: 0, y: 0, z: 0 });

  useFrame(({ clock }) => {
    if (refText.current) {
      refText.current.material.color.set(10);
      // Oscillate direction of rotation over time
      rotationDirection.y += rotationSpeed;

      refText.current.rotation.set(0, 0, 0);
      refText.current.rotation.y -= rotationSpeed * rotationDirection.y;
      refText.current.rotation.x -= rotationSpeed * rotationDirection.x;
      refText.current.rotation.x -= 0.3;
    }
  });

  return (
    <>
      <pointLight position={[0, 20, 10]} intensity={8} />
      <OrbitControls makeDefault enableZoom={false} />
      <Center>
        <Text3D
          ref={refText}
          font="./fonts/helvetiker_regular.typeface.json"
          size={0.2}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.0}
          bevelSegments={12}
        >
          42
          <meshStandardMaterial />
        </Text3D>
      </Center>
    </>
  );
};
