// (c) Delta Software 2023, rights reserved.
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { UserDeliveriesTable } from "../components/deliverables/UserDeliveriesTable";
import { useParams } from "react-router-dom";
import { IDelivery } from "../types";
import { Tabs } from "flowbite-react";

export default function ManagerDeliveries(): JSX.Element {
  const id = useParams().id;

  const { response: delivery } = useAxios<IDelivery>({
    url: `deliveries/${id}`,
    method: "GET",
  });

  const { response: ReviewedDeliveries } = useAxios<IDelivery>({
    url: `deliveries/reviewed/${id}`,
    method: "GET",
  });

  const { response: PendingDeliveries } = useAxios<IDelivery>({
    url: `deliveries/pending/${id}`,
    method: "GET",
  });

  // TODO: Hacer que el componente se actualice cuando haya un cambio
  const handleChange = () => {
    window.location.reload();
  };

  return (
    <Wrapper>
      <div>
        <div className="w-full flex items-center justify-start py-8">
          <h1 className=" font-bold py-3 px-20 bg-gnp-orange-500 text-white text-xl rounded-r-2xl">
            {delivery?.deliveryName}
          </h1>
        </div>
        <Tabs.Group
          aria-label="Default tabs"
          className="px-8 pb-4"
          style="default"
        >
          <Tabs.Item active={true} title="Sin Revisar">
            {PendingDeliveries && (
              <UserDeliveriesTable
                onUpdate={() => handleChange()}
                userDeliveries={PendingDeliveries.userDeliveries ?? []}
              />
            )}
          </Tabs.Item>
          <Tabs.Item title="Revisados">
            {ReviewedDeliveries && (
              <UserDeliveriesTable
                onUpdate={() => handleChange()}
                userDeliveries={ReviewedDeliveries.userDeliveries ?? []}
              />
            )}
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </Wrapper>
  );
}
