// (c) Delta Software 2023, rights reserved.
import {
  BsSend,
  BsSendCheck,
  BsSendExclamation,
  BsSendPlus,
  BsArrowRight,
} from "react-icons/bs";
import { DeliveryStatus } from "../../../types";
import { useUrlFile } from "../../../lib/files";

export type Colors = "blue" | "orange";

export interface DeliveryCardProps {
  deliveryId: string;
  nameDelivery: string;
  image: string;
  hasDelivery?: string;
  color: Colors;
  status: DeliveryStatus;
  fileUrl?: string;
}

const iconList = {
  "Sin enviar": <BsSendPlus color="gray" size={25} />,
  Enviado: <BsSend color="#197492" size={25} />,
  Rechazado: <BsSendExclamation color="#c22f0e" size={25} />,
  Aceptado: <BsSendCheck color="green" size={25} />,
};

export default function DeliveryCard({
  nameDelivery,
  color,
  status,
  fileUrl,
  hasDelivery,
}: DeliveryCardProps): JSX.Element {
  const colorOptions = {
    blue: "bg-gnp-blue-500",
    orange: "bg-gnp-orange-500",
  };

  const file = useUrlFile();

  return (
    <div
      className="grid w-full grid-cols-2  overflow-hidden rounded-b-lg bg-gnp-white shadow-lg"
      role="delivery"
    >
      <div className="grid grid-cols-3 ">
        <div className="relative">
          <img
            className="h-20 w-full object-cover"
            src={file(fileUrl as string)}
          />
          <div
            className={`absolute top-0 left-0 h-full w-full ${colorOptions[color]} bg-opacity-50`}
          ></div>
        </div>
        <div className="col-span-2 flex items-center justify-center text-center font-semibold">
          {nameDelivery}
        </div>
      </div>
      <div className="grid grid-cols-3 border-l-2 border-l-gray-300">
        <div className="col-span-2 flex items-center justify-center text-center font-semibold">
          {hasDelivery === "true" && (
            <div className="col-span-2 flex items-center justify-center text-center font-semibold">
              <div className="mr-4">{iconList[status]}</div>
              {status}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center text-center">
          <button className="pl-10">
            <BsArrowRight color="gray" size={35} />
          </button>
        </div>
      </div>
    </div>
  );
}
