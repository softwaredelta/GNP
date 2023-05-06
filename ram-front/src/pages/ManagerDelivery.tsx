// (c) Delta Software 2023, rights reserved.
import { useParams } from "react-router-dom";
import { UserDeliveriesTable } from "../components/deliverables/UserDeliveriesTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IDelivery } from "../types";
import { Tabs, Alert } from "flowbite-react";
import { AiFillWarning } from "react-icons/ai";

export default function ManagerDeliveries(): JSX.Element {
  const { id } = useParams();

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
        <div className="flex w-full items-center justify-start py-8">
          <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
            {delivery?.deliveryName}
          </h1>
        </div>
        <Tabs.Group
          aria-label="Default tabs"
          className="px-8 pb-4"
          style="default"
        >
          <Tabs.Item active={true} title="Sin Revisar">
            {PendingDeliveries ? (
              <UserDeliveriesTable
                onUpdate={() => handleChange()}
                userDeliveries={PendingDeliveries.userDeliveries ?? []}
              />
            ) : (
              <div className="flex flex-grid justify-center">
                <Alert
                  color="info"
                  icon={AiFillWarning}
                  className="font-bold w-2/3 text-center"
                >
                  {" "}
                  <h1 className="text-base"> No hay entregables sin revisar</h1>
                </Alert>
              </div>
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
