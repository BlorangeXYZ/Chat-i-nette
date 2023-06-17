import React, { useRef, useState } from "react";
import { Text3D, OrbitControls, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export const Text42 = ({ isMobile }: { isMobile: boolean }) => {
  const refText = useRef<Text3D>();

  const [hasEnded, setHasEnded] = useState(false);


  useFrame(() => {
    if (refText.current) {
      const { position, rotation, scale } = refText.current;
      refText.current.material.color.set(1);
      if (!hasEnded) {
        if(position.z === 0) {
          position.z = -1
        }
        const targetPositionZ = 0.1;
        const targetRotationY = 0.1;
        const targetScale = 1.1;
        if (position.z < targetPositionZ) {
          position.z += 0.015;
          const progress = position.z / targetPositionZ;
          const easedRotationY = progress * targetRotationY;
          const easedScale = 1 + progress * (targetScale - 1);
          rotation.y = easedRotationY;
          scale.setScalar(easedScale);
          if (position.z >= targetPositionZ) {
            setHasEnded(true);
          }
        }
      }
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
          size={isMobile ? 0.2 : 0.6}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={isMobile ? 0.01 : 0.02}
          bevelSegments={12}
        >
          CHAT-I-NETT
          <meshStandardMaterial />
        </Text3D>
      </Center>
    </>
  );
};
