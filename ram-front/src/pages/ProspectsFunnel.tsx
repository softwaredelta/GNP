// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import FunnelProspect from "../components/prospects/FunnelTable";

export default function FunnelProspects() {
  return (
    <Wrapper>
      <div>
        <div className="flex w-full items-center justify-start pt-8">
          <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
            Prospectos
          </h1>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center">
          <FunnelProspect />
        </div>
      </div>
    </Wrapper>
  );
}
