import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import earth from "/Users/dgsw48/WebstormProjects/untitled18/src/components/earthhd.jpg";
import Year from "./year";

export function Earth() {
    const texture = useLoader(TextureLoader,  earth ); // public 폴더에 넣어야 함

    return (
        <mesh>
            <sphereGeometry args={[2, 64, 64]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

export default function EarthScene() {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight />
            <directionalLight position={[5, 5, 5]} />
            <OrbitControls enableZoom={true}
                           // enablePan={false}         // 화면 끌어당기기 막음
                           enableRotate={true}      // 회전만 허용
                           autoRotate={false}       // 필요 시 true로 설정
                           target={[0, 0, 0]}
                           minDistance={2.8}
                           maxDistance={10}
            />
            <Earth />
        </Canvas>
    );
}
