// (c) Delta Software 2023, rights reserved.

import { FiEdit } from "react-icons/fi";
import useModal from "../../hooks/useModal";
import { IStatus } from "../../types";
import ModalModifyStatusProspect from "../forms/ModalModifyStatusProspect";

export interface ProspectsCardProps {
  listStatus?: IStatus[];
  id: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  prospectStatus: {
    status: IStatus;
    statusComment: string;
  }[];
  handleEdit: (
    prospectId: string,
    statusId: string,
    statusComment: string,
  ) => void;
}

export default function RowProspect({
  id,
  name,
  firstSurname,
  secondSurname,
  prospectStatus,
  listStatus,
  handleEdit,
}: ProspectsCardProps): JSX.Element {
  const colorOptions: { [key: string]: string } = {
    "Nuevo prospecto": "bg-gnp-blue-500",
    "Cita agendada": "bg-gnp-orange-500",
    "Cita efectiva": "bg-purple-500",
    "Solicitud de seguro": "bg-yellow-500",
    "Poliza pagada": "bg-green-500",
    Retirado: "bg-red-500",
  };
  const { isOpen, toggleModal } = useModal();

  return (
    <div className="mx-auto mt-5 grid w-10/12 grid-cols-1 overflow-hidden rounded bg-gnp-white  shadow-lg transition-all ease-in-out hover:scale-105 ">
      <div className="grid grid-cols-8 border-black/20">
        <div className="col-span-2 flex h-full w-full items-center justify-center py-4 px-4">
          {name} {firstSurname} {secondSurname}
        </div>

        <div className="justify-left flex h-full items-center space-x-6 border-l-2 border-black/10 py-4 px-4">
          <div>{prospectStatus[0].status.statusName}</div>
        </div>

        <div className="flex items-center justify-center space-x-6 py-4 px-4">
          <div
            className={`h-8 w-8 ${
              colorOptions[prospectStatus[0].status.statusName]
            } rounded-full`}
          ></div>
        </div>

        <div className=" col-span-3 flex h-full items-center justify-center border-l-2 border-black/10 py-4 px-4">
          {prospectStatus[0].statusComment.length > 50
            ? prospectStatus[0].statusComment.substring(0, 50) + "..."
            : prospectStatus[0].statusComment}{" "}
        </div>

        <div className="flex h-full items-center justify-center border-l-2 border-black/10 py-4 px-4 ">
          <ModalModifyStatusProspect
            statusId={prospectStatus[0].status.id}
            statusComment={prospectStatus[0].statusComment}
            prospectId={id}
            prospectName={`${name} ${firstSurname} ${secondSurname}`}
            listStatus={listStatus}
            isOpenModal={isOpen}
            closeModal={toggleModal}
            handleEdit={(prospectId, statusId, statusComment) =>
              handleEdit(prospectId, statusId, statusComment)
            }
          />
          <button
            className="mr-2 cursor-pointer transition-all ease-in-out hover:scale-125"
            onClick={(event) => {
              event.stopPropagation();
              toggleModal();
            }}
          >
            <FiEdit className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
