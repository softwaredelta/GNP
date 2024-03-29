// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=790712334
// * M5_S06
import { useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import Wrapper from "../containers/Wrapper";
import { IProspect } from "../types";
import ListProspects from "../components/prospects/ListProspects";

export default function ManageProspects() {
  const { id: agentId } = useParams();

  const { response: prospectsResponse } = useAxios<{
    prospects: IProspect[];
    agentName: string;
  }>({
    url: `prospect/get-agentprospect/${agentId}`,
    method: "GET",
  });
  return (
    <Wrapper title={`Prospectos de: ${prospectsResponse?.agentName}`}>
      <>
        <div>
          {prospectsResponse && (
            <ListProspects
              prospects={prospectsResponse.prospects}
              handleStatusEdit={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          )}
        </div>
      </>
    </Wrapper>
  );
}
