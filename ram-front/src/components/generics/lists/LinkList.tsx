// (c) Delta Software 2023, rights reserved.

import { Table } from "flowbite-react";
import LinkRow from "./LinkRow";
import useModal from "../../../hooks/useModal";
import Swal from "sweetalert2";
import ModalLinks from "../../forms/ModalLinks";
import { ILink } from "../../../types";
import { MdAddLink } from "react-icons/md";

interface ILinkListProps {
  links: ILink[];
  handlePost: (link: string, name: string) => void;
  handleDelete: (id: string) => void;
  handleEdit: (id: string, link: string, name: string) => void;
}

const LinkList = ({
  links,
  handleDelete,
  handleEdit,
  handlePost,
}: ILinkListProps) => {
  const { isOpen: isOpenLinkModal, toggleModal: toggleModalLink } = useModal();

  return (
    <>
      <div className="mb-3 inline-block flex items-center justify-between">
        <label className="ml-3 block text-2xl font-bold">Lista de links</label>
        <div className="ml-4">
          <button
            className="btn-primary flex items-center justify-center"
            onClick={toggleModalLink}
          >
            Agregar
            {<MdAddLink className="ml-2" size={20} />}
          </button>
        </div>
      </div>
      <ModalLinks
        isOpenModal={isOpenLinkModal}
        closeModal={toggleModalLink}
        handlePost={(link, name) => {
          if (!name) {
            Swal.fire({
              title: "Texto faltante",
              text: "Ingrese texto con el que se identificará el link",
              icon: "error",
            });
            return;
          }
          if (!link) {
            Swal.fire({
              title: "Link faltante",
              text: "Ingrese el hipervínculo que desea agregar",
              icon: "error",
            });
            return;
          }
          handlePost(link, name);
          toggleModalLink();
        }}
      />
      <div className="max-h-96 overflow-y-auto rounded-xl shadow-md">
        <Table className="row" hoverable={true}>
          <Table.Head className="border-2 border-gray-300">
            <Table.HeadCell className="bg-gray-300">Nombre</Table.HeadCell>
            <Table.HeadCell className="bg-gray-300">Acciones</Table.HeadCell>
          </Table.Head>

          <Table.Body>
            {links.map((index) => {
              return (
                <LinkRow
                  key={index.id}
                  link={index.link}
                  name={index.name}
                  id={index.id}
                  onEdited={(id, link, name) => {
                    handleEdit(id, link, name);
                  }}
                  onDeleted={(id) => {
                    handleDelete(id);
                  }}
                />
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default LinkList;
