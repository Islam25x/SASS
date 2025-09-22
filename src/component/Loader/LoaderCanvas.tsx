import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Preload } from "@react-three/drei"
import { Mesh } from "three"

function Loader() {
    const { scene } = useGLTF("3D/scene.gltf")
    const cardRef = useRef<Mesh>(null)

    useFrame(() => {
        if (cardRef.current) {
            cardRef.current.rotation.y += 0.01
            cardRef.current.rotation.x = 0.2
        }
    })

    return (
        <mesh ref={cardRef}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <hemisphereLight intensity={0.35} groundColor="black" />
            <primitive object={scene} scale={.03} position={[0, 0, 0]} />
        </mesh>
    )
}

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
            <Loader />
            <Preload all />
        </Canvas>
    )
}

export default LoaderCanvas
