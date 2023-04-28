// (c) Delta Software 2023, rights reserved.
import { useParams } from "react-router-dom";
import ListDeliverables, {
  IUserDeliverable,
} from "../components/deliverables/ListDeliverables";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";

export default function Group(): JSX.Element {
  const { id: idGroup } = useParams();

  const { response, error, loading } = useAxios<{
    data: {
      userDeliveries: IUserDeliverable[];
    };
  }>({
    url: `deliveries/my-deliveries/${idGroup}`,
    method: "GET",
  });

  if (loading) return <h1>Loading...</h1>;

  if (error) {
    console.log({ error });
    return <h1>Error...</h1>;
  }

  return (
    <Wrapper>
      <div>
        <div className="w-full flex items-center justify-start py-8">
          <h1 className=" font-bold py-3 px-20 bg-gnp-orange-500 text-white text-xl rounded-r-2xl">
            {response && response.data.userDeliveries[0].groupName}
          </h1>
        </div>
        {response && (
          <ListDeliverables deliverables={response.data.userDeliveries} />
        )}
      </div>
    </Wrapper>
  );
}
