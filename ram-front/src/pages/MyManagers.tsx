// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=2023282790
// * M4_S01

import TableMembers from "../components/members/TableMembers";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IMembers } from "../types";
export default function MyManagers() {
  const {
    response: membersResponse,
    loading: loadingMembers,
    error: errorMembers,
    callback: refreshMembers,
  } = useAxios<IMembers[]>({
    url: "user/managers",
    method: "GET",
  });

  if (loadingMembers) return <h1>Loading ...</h1>;
  if (errorMembers) return <h1>Error ...</h1>;

  return (
    <Wrapper title="Mis Gerentes">
      <>
        <div className="mt-5 flex w-full justify-center">
          {membersResponse && (
            <div className="w-4/5">
              <TableMembers
                members={membersResponse}
                updateMembers={refreshMembers}
                isManager={false}
              />
            </div>
          )}
        </div>
      </>
    </Wrapper>
  );
}
