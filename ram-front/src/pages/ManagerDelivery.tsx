// (c) Delta Software 2023, rights reserved.
import { useParams } from "react-router-dom";
import { UserDeliveriesTable } from "../components/deliverables/UserDeliveriesTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IDelivery } from "../types";

export default function ManagerDeliveries(): JSX.Element {
  const { id } = useParams();

  const { response: delivery } = useAxios<IDelivery>({
    url: `deliveries/${id}`,
    method: "GET",
  });

  return (
    <Wrapper>
      <div>
        <div className="w-full flex items-center justify-start py-8">
          <h1 className=" font-bold py-3 px-20 bg-gnp-orange-500 text-white text-xl rounded-r-2xl">
            {delivery?.deliveryName}
          </h1>
        </div>
        {delivery && (
          <UserDeliveriesTable userDeliveries={delivery.userDeliveries ?? []} />
        )}
      </div>
    </Wrapper>
  );
}
