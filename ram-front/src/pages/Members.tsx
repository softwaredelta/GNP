// (c) Delta Software 2023, rights reserved.
import TableMembers from "../components/members/TableMembers";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IMembers } from "../types";
export default function Members() {
  const { response, loading, error } = useAxios<IMembers[]>({
    url: "user/members",
    method: "GET",
  });

  if (loading) return <h1>Loading ...</h1>;
  if (error) return <h1>Error ...</h1>;

  return (
    <Wrapper title="Miembros">
      <>
        <div className="w-1/12 overflow-hidden rounded-3xl font-bold">
          <button
            onClick={() => {
              alert("Agregar");
            }}
            className="btn-primary"
          >
            Agregar
          </button>
        </div>

        {response && <TableMembers members={response} />}
      </>
    </Wrapper>
  );
}
