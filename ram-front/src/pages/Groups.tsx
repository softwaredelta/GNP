// (c) Delta Software 2023, rights reserved.
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
    <Wrapper>
      <div>
        <div className="flex w-full items-center justify-start py-8">
          <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
            Groups
          </h1>
        </div>

        <div className=" grid place-items-center gap-10 sm:grid-cols-2 xl:grid-cols-4">
          {response && (
            <ListGroup
              groups={response?.data.groups.map(
                (item): IGroup => ({
                  ...item.group,
                  progress:
                    (item.numberOfDeliveries / item.totalDeliveries) * 100,
                }),
              )}
            />
          )}
        </div>
      </div>
    </Wrapper>
  );
}
