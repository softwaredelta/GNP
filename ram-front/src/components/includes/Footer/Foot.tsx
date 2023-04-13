// (c) Delta Software 2023, rights reserved.

import React from "react";
import { Footer } from "flowbite-react";

import wavesRAM from "../../../assets/imgs/wavesRAM.png";

type Props = {};

function Foot({}: Props) {
  return (
    <Footer container={false}>
      {/* <div className='h-20 w-full'> */}
      <img className="h-60 w-full" src={wavesRAM} alt="Footer de la página " />
    </Footer>
  );
}

export default Foot;
