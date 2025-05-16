import EarthScene from "./components/Earth";
import Year from "./components/year";

export default function App() {
    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <EarthScene />

            {/* 화면 고정 텍스트 */}
            <div style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                zIndex: 10
            }}>
                <Year/>
            </div>
        </div>
    );
}
