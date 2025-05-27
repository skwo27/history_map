import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { YearlyBorders } from "./GeoJsonBorders";

export function Earth({ year, onCountryClick }) {
    const texture = useLoader(TextureLoader, "/earth.jpg");
    
    return (
        <>
            <mesh>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial map={texture} />
            </mesh>
            
            {/* 국경선 렌더링 컴포넌트 */}
            <YearlyBorders 
                baseUrl="/data"
                year={year}
                radius={2.000001} // 지구본 표면 위에 살짝 띄우기
                color="white"
                lineWidth={1}
                opacity={0.8}
                onCountryClick={onCountryClick}
            />
        </>
    );
}

export default function EarthScene() {
    const [year, setYear] = useState(2010);
    const [selectedCountry, setSelectedCountry] = useState(null);
    
    // 국가 클릭 이벤트 핸들러
    const handleCountryClick = (properties) => {
        setSelectedCountry(properties);
        console.log("Selected country:", properties);
    };
    
    // 연도 변경 핸들러
    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value));
    };
    
    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <OrbitControls 
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={false}
                    target={[0, 0, 0]}
                    minDistance={2.8}
                    maxDistance={10}
                />
                <Earth year={year} onCountryClick={handleCountryClick} />
            </Canvas>
            
            {/* 연도 선택 UI */}
            <div style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.7)",
                padding: "10px",
                borderRadius: "5px",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{ marginBottom: "5px" }}>
                    <span>연도: {year}</span>
                </div>
                <input
                    type="range"
                    min="1900"
                    max="2010"
                    step="1"
                    value={year}
                    onChange={handleYearChange}
                    style={{ width: "300px" }}
                />
            </div>
        </div>
    );
}
