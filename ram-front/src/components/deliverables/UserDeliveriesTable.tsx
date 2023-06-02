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

  return (
    <div data-testid="Table" className="w-full">
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell align="center">Agente</Table.HeadCell>
          <Table.HeadCell align="center">Correo </Table.HeadCell>
          <Table.HeadCell align="center">Estado</Table.HeadCell>
          <Table.HeadCell align="center">Fecha de Subida</Table.HeadCell>
          <Table.HeadCell align="center">Acciones</Table.HeadCell>
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
