// (c) Delta Software 2023, rights reserved.

import { Footer } from "flowbite-react";
import wavesRAM from "../../../assets/imgs/wavesRAM.png";
function Foot() {
  return (
    <Footer container={false}>
      <img
        className="h-60 w-full select-none "
        src={wavesRAM}
        alt="Footer de la página "
      />
    </Footer>
  );
}

export default Foot;
