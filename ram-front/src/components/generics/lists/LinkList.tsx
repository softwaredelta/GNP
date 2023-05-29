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
  handlePost?: (link: string, name: string) => void;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string, link: string, name: string) => void;
  isEdit?: boolean;
}

const LinkList = ({
  links,
  handleDelete,
  handleEdit,
  handlePost,
  isEdit = true,
}: ILinkListProps) => {
  const { isOpen: isOpenLinkModal, toggleModal: toggleModalLink } = useModal();
  console.log(links);
  return (
    <>
      <div className="mb-3 inline-block flex items-center justify-between">
        <label className="ml-3 block text-2xl font-bold">Lista de links</label>
        <div className="ml-4">
          {isEdit && (
            <button
              className="btn-primary flex items-center justify-center"
              onClick={toggleModalLink}
            >
              Agregar
              {<MdAddLink className="ml-2" size={20} />}
            </button>
          )}
        </div>
      </div>
      {isEdit && (
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
            if (handlePost) handlePost(link, name);
            toggleModalLink();
          }}
        />
      )}
      <div
        className={`overflow-y-auto rounded-xl shadow-md ${
          isEdit ? "max-h-96" : "max-h-80"
        }`}
      >
        <Table className="row" hoverable={true}>
          <Table.Head className="border-2 border-gray-300">
            <Table.HeadCell className="bg-gray-300">Nombre</Table.HeadCell>
            {isEdit && (
              <Table.HeadCell className="bg-gray-300">Acciones</Table.HeadCell>
            )}
          </Table.Head>
          {links.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              {isEdit ? "Aún no hay links" : "No tienes links aún"}
            </div>
          ) : (
            <Table.Body>
              {isEdit
                ? links.map((index: ILink) => (
                    <LinkRow
                      key={index.id}
                      link={index.link}
                      name={index.name}
                      id={index.id}
                      isEdit={isEdit}
                      onEdited={(id, link, name) => {
                        if (handleEdit) handleEdit(id, link, name);
                      }}
                      onDeleted={(id) => {
                        if (handleDelete) handleDelete(id);
                      }}
                    />
                  ))
                : links.map((index: ILink) => (
                    <LinkRow
                      key={index.id}
                      link={index.link}
                      name={index.name}
                      isEdit={isEdit}
                      id={index.id}
                    />
                  ))}
            </Table.Body>
          )}
        </Table>
      </div>
    </>
  );
};

export default LinkList;
