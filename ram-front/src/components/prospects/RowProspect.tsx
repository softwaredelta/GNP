// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1001315964
// * M5_S01
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=148429501
// * M5_S04

import { FiEdit, FiEye } from "react-icons/fi";
import useModal from "../../hooks/useModal";
import { useAuthentication } from "../../lib/api/api-auth";
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

  const { auth } = useAuthentication();

  return (
    <div className="mx-auto mt-5 grid w-10/12 cursor-pointer grid-cols-1 overflow-hidden rounded bg-gnp-white shadow-lg transition-all ease-in-out hover:scale-105 ">
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
          <div>
            {auth?.roles[0] === "manager" ? (
              <button className="mr-2 cursor-pointer transition-all ease-in-out hover:scale-110">
                <FiEye size={25} />
              </button>
            ) : (
              <button
                className="mr-2 cursor-pointer transition-all ease-in-out hover:scale-110"
                onClick={(event) => {
                  event.stopPropagation();
                  toggleModal();
                }}
              >
                <FiEdit size={25} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
