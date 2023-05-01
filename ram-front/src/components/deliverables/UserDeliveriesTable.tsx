// (c) Delta Software 2023, rights reserved.
import { Table } from "flowbite-react";
import { IUserDelivery } from "../../types";
import { UserDeliveryRow } from "./UserDeliveryRow";
import { useEffect, useState } from "react";

interface Props {
  userDeliveries: IUserDelivery[];
  onUpdate: () => void;
}

export function UserDeliveriesTable({ userDeliveries, onUpdate }: Props) {
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  useEffect(() => {
    if (shouldUpdate) {
      onUpdate();
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);

  if (userDeliveries.length === 0) return <h1>No hay entregables</h1>;
  return (
    <div data-testid="Table" className="w-full">
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>Agente</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>Estado</Table.HeadCell>
          <Table.HeadCell>Entregable</Table.HeadCell>
          <Table.HeadCell>Fecha de Subida</Table.HeadCell>
          <Table.HeadCell>Acciones</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
          {userDeliveries.map((delivery, index) => {
            return (
              <UserDeliveryRow
                key={index}
                delivery={delivery}
                onUpdate={() => {
                  setShouldUpdate(true);
                }}
              />
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
