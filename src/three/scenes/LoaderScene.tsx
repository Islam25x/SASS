import CardModel from "../models/CardModel";

const LoaderScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <hemisphereLight intensity={0.35} groundColor="black" />
      <CardModel />
    </>
  );
};

export default LoaderScene;
