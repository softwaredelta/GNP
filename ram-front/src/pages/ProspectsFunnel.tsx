// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=716285224
// * M5_S05

import Wrapper from "../containers/Wrapper";
import FunnelProspect from "../components/prospects/FunnelTable";
import { IUser } from "../types";
import useAxios from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
export default function FunnelProspects() {
  const { response: agents } = useAxios<IUser[]>({
    url: `user/all-agents`,
    method: "GET",
  });
  const navigate = useNavigate();

  const handleOnClick = (id: string) => {
    navigate(`/agent-prospects/${id}`);
  };

  return (
    <Wrapper>
      <div>
        <div className="flex w-full items-center justify-start pt-8">
          <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
            Prospectos
          </h1>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center">
          {agents && (
            <FunnelProspect agents={agents} handleOnClick={handleOnClick} />
          )}
        </div>
      </div>
    </Wrapper>
  );
}
