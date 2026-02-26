import { Canvas } from "@react-three/fiber"
import { OrbitControls, Preload } from "@react-three/drei"
import LoaderScene from "../scenes/LoaderScene"

const LoaderCanvas = () => {
    return (
        <Canvas
            frameloop="always"
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 20], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
            className="w-full h-full"
        >
            <OrbitControls
                enableZoom={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
            />
            <LoaderScene />
            <Preload all />
        </Canvas>
    )
}

export default LoaderCanvas
