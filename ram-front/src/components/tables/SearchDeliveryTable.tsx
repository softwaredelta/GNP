import { Table } from "flowbite-react";
import { SearchDeliveryRow } from "./SearchDeliveryRow";
import { IDelivery } from "../../types";
// (c) Delta Software 2023, rights reserved.>

export interface IListSalesProps {
  deliveries: IDelivery[];
  onReloadDeliveries: () => void;
}

export default function SearchDeliveryTable({
  deliveries,
  onReloadDeliveries,
}: IListSalesProps) {
  return (
    <>
      <Table className="row" hoverable={true}>
        <Table.Head className="border-2 border-gray-300">
          <Table.HeadCell className="bg-gray-300"></Table.HeadCell>
          <Table.HeadCell className="bg-gray-300">
            Nombre del entregable:
          </Table.HeadCell>
          <Table.HeadCell className="bg-gray-300">Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {deliveries.length > 0 ? (
            deliveries.map((node, index) => (
              <SearchDeliveryRow
                delivery={node}
                key={index}
                onReloadDeliveries={onReloadDeliveries}
              />
            ))
          ) : (
            <p className="text-center">No hay entregables en el grupo</p>
          )}
        </Table.Body>
      </Table>
    </>
  );
}
