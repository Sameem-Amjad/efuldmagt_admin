import { BeatLoader } from "react-spinners";

const Loader = () => {
  return (
    <BeatLoader
      color={"#000"}
      loading={true}
      size={15}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loader;
