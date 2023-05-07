// (c) Delta Software 2023, rights reserved.

import React from "react";
import wip_1 from "../../assets/imgs/wip_1.svg";
import Wrapper from "../../containers/Wrapper";

export default function GoalsHistory() {
  return (
    <Wrapper>
      <div>
        <div className="flex items-center justify-center p-4">
          <img
            src={wip_1}
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
          Metas{" "}
        </h1>
      </div>
    </Wrapper>
  );
}
