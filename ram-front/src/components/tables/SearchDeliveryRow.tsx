import { Checkbox, Table } from "flowbite-react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IDelivery } from "../../types";
// (c) Delta Software 2023, rights reserved.

export interface IListSalesProps {
  delivery: IDelivery;
}

export const SearchDeliveryRow = ({ delivery }: IListSalesProps) => {
  return (
    <>
      <Table.Row key={delivery.id} className="border-2 border-gray-300">
        <Table.Cell>
          <Checkbox className="border-gray-400" />
        </Table.Cell>
        <Table.Cell>
          <img
            className="w-30 h-14 rounded-lg"
            src={delivery.imageUrl}
            alt="Profile Image"
          />
        </Table.Cell>
        <Table.Cell>{delivery.deliveryName}</Table.Cell>
        <Table.Cell>
          <button
            className="mr-2 cursor-pointer transition-all ease-in-out hover:scale-125"
            onClick={() => alert("Redireccionando a editar delivery ...")}
          >
            <FiEdit
              color="gray"
              size={20}
              className="hover:stroke-gnp-blue-900"
            />
          </button>
          <button
            className="cursor-pointer transition-all ease-in-out hover:scale-125"
            onClick={() => alert("Redireccionando a eliminar delivery ...")}
          >
            <FiTrash2 color="gray" size={20} className="hover:stroke-red-900" />
          </button>
        </Table.Cell>
      </Table.Row>
    </>
  );
};
