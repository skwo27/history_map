import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { YearlyBorders } from "./GeoJsonBorders";

export function getYear() {
    return [
        1000, 1100,
        1200, 1279, 1300, 1400, 1492,
        1500, 1530, 1600, 1650,
        1700, 1715, 1783, 1800, 1815, 1880,
        1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994,
        2000, 2010
    ];
}


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
                radius={2.001} // 지구본 표면 위에 살짝 띄우기
                color="white"
                lineWidth={1}
                opacity={0.8}
            />
        </>
    );
}

export default function EarthScene() {
    const [year, setYear] = useState(2010);

    const handleYearChange = (e) => {
        setYear(parseInt(e.target.value));
    };


    function earthClicked(){
        console.log("spaceClicked");
        setAutoTurn(autoTurn !== true)
    }

    window.addEventListener("keyup", fKeyUp, true);
    function fKeyUp(e){
        if(e.keyCode === 32){
            earthClicked()
        }
    }

    const maxYear = getYear()[getYear().length - 1];
    const minYear = getYear()[0];
    let [autoTurn, setAutoTurn] = useState(false);
    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={autoTurn}
                    autoRotateSpeed={1.5}
                    target={[0, 0, 0]}
                    minDistance={2.8}
                    maxDistance={10}
                />
                <Earth year={year}/>
            </Canvas>

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
                <input //슬라이더
                    type="range"
                    max={maxYear}
                    min={minYear}
                    step="1"
                    value={year}
                    onChange={handleYearChange}
                    style={{ width: "400px" }}
                />
            </div>
        </div>

    );
}
