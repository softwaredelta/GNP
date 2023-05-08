// (c) Delta Software 2023, rights reserved.
import { useParams } from "react-router-dom";
import ListDeliverables from "../components/deliverables/ListDeliverables";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IUserDelivery } from "../types";

export default function Group(): JSX.Element {
  const { id: idGroup } = useParams();

  const { response, error, loading } = useAxios<IUserDelivery[]>({
    url: `deliveries/my-deliveries/${idGroup}`,
    method: "GET",
  });

  if (loading) return <h1>Loading...</h1>;

  return (
    <Wrapper>
      <div>
        {response && response.length ? (
          <>
            <div className="flex w-full items-center justify-start py-8">
              <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
                {response && response[0].delivery?.group?.name}
              </h1>
            </div>
            <ListDeliverables deliverables={response} />
          </>
        ) : (
          <></>
        )}
      </div>
    </Wrapper>
  );
}
