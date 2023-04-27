// (c) Delta Software 2023, rights reserved.
import ListGroup, { IGroup } from "../components/groups/ListGroup";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";

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
        <div className="w-full flex items-center justify-start py-8">
          <h1 className=" font-bold py-3 px-20 bg-gnp-orange-500 text-white text-xl rounded-r-2xl">
            Groups
          </h1>
        </div>

        <div className=" grid sm:grid-cols-2 xl:grid-cols-4 place-items-center gap-10">
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
