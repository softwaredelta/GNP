// (c) Delta Software 2023, rights reserved.
import { Alert, Tabs } from "flowbite-react";

import { FiAlertTriangle } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { UserDeliveriesTable } from "../components/deliverables/UserDeliveriesTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IDelivery } from "../types";

export default function ManagerDeliveries(): JSX.Element {
  const { id } = useParams();

  const { response: delivery, callback: updateDelivery } = useAxios<IDelivery>({
    url: `deliveries/${id}`,
    method: "GET",
  });

  const handleChange = () => {
    updateDelivery();
  };

  console.log(delivery);

  return (
    <Wrapper title={delivery?.deliveryName}>
      <div className="mt-8">
        <Tabs.Group
          aria-label="Default tabs"
          className="px-8 pb-4"
          style="default"
        >
          <Tabs.Item active={true} title="Sin Revisar">
            {delivery ? (
              <UserDeliveriesTable
                onUpdate={handleChange}
                userDeliveries={
                  delivery.userDeliveries?.filter(
                    (userDelivery) => userDelivery.status === "Enviado",
                  ) ?? []
                }
              />
            ) : (
              <div className="flex-grid flex justify-center">
                <Alert
                  color="info"
                  icon={FiAlertTriangle}
                  className="w-2/3 text-center font-bold"
                >
                  {" "}
                  <h1 className="text-base"> No hay entregables sin revisar</h1>
                </Alert>
              </div>
            )}
          </Tabs.Item>
          <Tabs.Item title="Revisados">
            {delivery ? (
              <UserDeliveriesTable
                onUpdate={handleChange}
                userDeliveries={
                  delivery.userDeliveries?.filter(
                    (userDelivery) =>
                      userDelivery.status !== "Enviado" &&
                      userDelivery.status !== "Sin enviar",
                  ) ?? []
                }
              />
            ) : (
              <div className="flex-grid flex justify-center">
                <Alert
                  color="info"
                  icon={FiAlertTriangle}
                  className="w-2/3 text-center font-bold"
                >
                  {" "}
                  <h1 className="text-base"> No hay entregables revisados</h1>
                </Alert>
              </div>
            )}
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </Wrapper>
  );
}
