import { Checkbox, Table } from "flowbite-react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IDelivery } from "../../types";
import { useUrlFile } from "../../lib/files";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import ModalDeliveryFormUpdate from "../forms/ModalDeliveryFormUpdate";
import useModal from "../../hooks/useModal";
// (c) Delta Software 2023, rights reserved.

export interface IListSalesProps {
  delivery: IDelivery;
}
export const SearchDeliveryRow = ({ delivery }: IListSalesProps) => {
  const fileUrl = useUrlFile();

  const { callback } = useAxios({
    url: `deliveries/${delivery.id}`,
    method: "DELETE",
    body: {},
  });

  function handleDelete() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
        console.log("Delivery ID: " + delivery.id);
        Swal.fire({
          title: "Eliminado",
          text: "El grupo ha sido eliminado con éxito",
          icon: "success",
          timer: 5000,
        });
      }
    });
  }
  const { isOpen: isOpenDeliveryForm, toggleModal: toggleModalDeliveryForm } =
    useModal();

  return (
    <>
      <Table.Row key={delivery.id} className="border-2 border-gray-300">
        <Table.Cell>
          <Checkbox className="border-gray-400" />
        </Table.Cell>
        <Table.Cell>
          <img
            className="w-30 h-14 rounded-lg"
            src={fileUrl(delivery.imageUrl)}
            alt="Profile Image"
          />
        </Table.Cell>
        <Table.Cell>{delivery.deliveryName}</Table.Cell>
        <Table.Cell>
          <button
            className="mr-2 cursor-pointer transition-all ease-in-out hover:scale-125"
            onClick={toggleModalDeliveryForm}
          >
            <FiEdit
              color="gray"
              size={20}
              className="hover:stroke-gnp-blue-900"
            />
          </button>
          <ModalDeliveryFormUpdate
            isOpenModal={isOpenDeliveryForm}
            closeModal={toggleModalDeliveryForm}
            deliveryId={delivery.id}
          />
          <button
            className="cursor-pointer transition-all ease-in-out hover:scale-125"
            onClick={() => handleDelete()}
          >
            <FiTrash2 color="gray" size={20} className="hover:stroke-red-900" />
          </button>
        </Table.Cell>
      </Table.Row>
    </>
  );
};
