// (c) Delta Software 2023, rights reserved.

import React from "react";
import wip_3 from "../../assets/imgs/wip_3.svg";
import Wrapper from "../../containers/Wrapper";

export default function Help() {
  return (
    <Wrapper>
      <div>
        <div className="flex items-center justify-center p-4">
          <img
            src={wip_3}
            className="h-1/2 w-1/2 md:h-1/5 md:w-1/5"
            alt="Work in progress"
          />
        </div>
        <h1 className="flex justify-center text-3xl font-bold text-gnp-blue-900">
          {" "}
          Estamos trabajando en
        </h1>
        <h1 className="flex justify-center text-3xl font-bold text-orange-500">
          {" "}
          Ayuda (FAQ){" "}
        </h1>
      </div>
    </Wrapper>
  );
}
