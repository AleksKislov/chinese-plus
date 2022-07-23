import spinnerImg from "./spinner.gif";
import Image from "next/image";
const Spinner = () => (
  <>
    <Image src={spinnerImg} alt='Loading...' width={"80px"} height={"80px"} />
  </>
);

export default Spinner;
