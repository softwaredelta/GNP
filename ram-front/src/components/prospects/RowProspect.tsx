// (c) Delta Software 2023, rights reserved.

import { FiEdit } from "react-icons/fi";
import { IStatus } from "../../types";

export interface ProspectsCardProps {
  id: string;
  name: string;
  firstSurname: string;
  secondSurname: string;
  prospectStatus: {
    status: IStatus;
    statusComment: string;
  }[];
}

export default function RowProspect({
  name,
  firstSurname,
  secondSurname,
  prospectStatus,
}: ProspectsCardProps): JSX.Element {
  const colorOptions: { [key: string]: string } = {
    "Nuevo prospecto": "bg-gnp-blue-500",
    "Cita agendada": "bg-gnp-orange-500",
    "Cita efectiva": "bg-purple-500",
    "Solicitud de seguro": "bg-yellow-500",
    "Poliza pagada": "bg-green-500",
    Retirado: "bg-red-500",
  };
  return (
    <div className="mx-auto mt-5 grid w-10/12 grid-cols-1 overflow-hidden rounded bg-gnp-white  shadow-lg transition-all ease-in-out hover:scale-110 ">
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
          {prospectStatus[0].statusComment}
        </div>

        <div className="flex h-full items-center justify-center border-l-2 border-black/10 py-4 px-4 ">
          <button className="mr-2 cursor-pointer transition-all ease-in-out hover:scale-125">
            <FiEdit className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
