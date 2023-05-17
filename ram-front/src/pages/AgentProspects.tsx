// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { IProspect, IUser } from "../types";
import useAxios from "../hooks/useAxios";
import { useParams } from "react-router-dom";

export default function AgentProspects() {
  const { id } = useParams();

  const {
    response,
  }: { response: { agent: IUser; prospects: IProspect[] } | null } = useAxios<{
    agent: IUser;
    prospects: IProspect[];
  } | null>({
    url: `user/prospect/agent/${id}`,
    method: "GET",
  });

  return (
    <Wrapper>
      <div>
        <div className="flex w-full items-center justify-start pt-8">
          <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
            Prospectos para {response?.agent.name}
          </h1>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center"></div>
      </div>
    </Wrapper>
  );
}
