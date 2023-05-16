// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import FunnelProspect from "../components/prospects/FunnelTable";
import { IUser } from "../types";
import useAxios from "../hooks/useAxios";

export default function AgentProspects() {
  const { response: agents } = useAxios<IUser[]>({
    url: `user/all-agents`,
    method: "GET",
  });

  return (
    <Wrapper>
      <div>
        <div className="flex w-full items-center justify-start pt-8">
          <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
            Prospectos
          </h1>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center">
          {agents && <FunnelProspect agents={agents} />}
        </div>
      </div>
    </Wrapper>
  );
}
