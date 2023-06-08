// (c) Delta Software 2023, rights reserved.

// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=957708639
// * M1_S01
import ListGroup from "../components/groups/ListGroup";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IGroup } from "../types";

export default function Groups(): JSX.Element {
  const { response, loading, error } = useAxios<{
    data: {
      groups: {
        group: IGroup;
        numberOfDeliveries: number;
        totalDeliveries: number;
      }[];
    };
  }>({
    url: "groups/my-groups",
    method: "GET",
  });

  if (loading) return <h1>Loading ...</h1>;
  if (error) return <h1>Error ...</h1>;

  return (
    <Wrapper title="Grupos">
      <div>
        <div className=" mt-10 grid place-items-center gap-10 sm:grid-cols-2 xl:grid-cols-4">
          {response && (
            <ListGroup
              groups={response?.data.groups.map(
                (item): IGroup => ({
                  ...item.group,
                  progress: Math.trunc(
                    (item.numberOfDeliveries / item.totalDeliveries) * 100,
                  ),
                }),
              )}
            />
          )}
        </div>
      </div>
    </Wrapper>
  );
}
