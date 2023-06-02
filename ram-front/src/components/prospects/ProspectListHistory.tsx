// (c) Delta Software 2023, rights reserved.

import { Status } from "../../types";

export interface Props {
  status: Status | undefined;
  statusComment: string;
  updatedStatusDate: Date | undefined;
}

export function ProspectListHistory({
  status,
  statusComment,
  updatedStatusDate,
}: Props) {
  function getColorClass(option: string) {
    switch (option) {
      case "Nuevo prospecto":
        return "bg-gnp-blue-500";
      case "Cita agendada":
        return "bg-gnp-orange-500";
      case "Cita efectiva":
        return "bg-purple-500";
      case "Solicitud de seguro":
        return "bg-yellow-500";
      case "Poliza pagada":
        return "bg-green-500";
      case "Retirado":
        return "bg-red-500";
      default:
        return "bg-gnp-blue-500";
    }
  }
  const dateStr = updatedStatusDate?.toString();
  const date = dateStr ? new Date(dateStr) : undefined;

  return (
    <div className="my-3">
      <div className="flex rounded-md border-black bg-[#f5f5f5] p-4 shadow-md">
        <div className="flex w-1/3 items-center justify-center">
          <div className="mr-2 flex items-center justify-center text-center">
            <div
              className={`h-4 w-4 rounded-full  ${getColorClass(
                status?.statusName || "",
              )}`}
            ></div>
          </div>
          <p className="text-center font-semibold text-gray-500">
            {status?.statusName}
          </p>
        </div>
        <div className="flex w-5/6 items-center justify-center">
          <div className="mb-2 text-center">
            <p className="font-semibold text-gray-500">{statusComment}</p>
          </div>
        </div>
        <div className="flex w-2/3 items-center justify-center">
          <div className="mb-2 text-right">
            <span className="text-center font-semibold text-gray-500">
              {date?.toLocaleDateString() + " " + date?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProspectListHistory;
