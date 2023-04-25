// (c) Delta Software 2023, rights reserved.
import { FiUpload, FiEye } from "react-icons/fi";
import {
  BsSendPlus,
  BsSend,
  BsSendExclamation,
  BsSendCheck,
} from "react-icons/bs";

export type Colors = "blue" | "orange";
export type StatusDelivery =
  | "Sin enviar"
  | "Enviado"
  | "Rechazado"
  | "Aceptado";

export interface DeliveryCardProps {
  nameDelivery: string;
  image: string;
  color: Colors;
  status: StatusDelivery;
}

const iconList = {
  "Sin enviar": <BsSendPlus color="gray" size={25} />,
  Enviado: <BsSend color="#197492" size={25} />,
  Rechazado: <BsSendExclamation color="#c22f0e" size={25} />,
  Aceptado: <BsSendCheck color="green" size={25} />,
};

export default function DeliveryCard({
  nameDelivery,
  image,
  color,
  status,
}: DeliveryCardProps): JSX.Element {
  const colorOptions = {
    blue: "bg-gnp-blue-500",
    orange: "bg-gnp-orange-500",
  };
  return (
    <div className="w-full grid grid-cols-2  rounded-b-lg overflow-hidden bg-gnp-white shadow-lg">
      <div className="grid grid-cols-3 ">
        <div className="relative">
          <img className="w-full h-20 object-cover" src={image} />
          <div
            className={`absolute top-0 left-0 w-full h-full ${colorOptions[color]} bg-opacity-50`}
          ></div>
        </div>
        <div className="col-span-2 flex items-center text-center justify-center font-semibold">
          {nameDelivery}
        </div>
      </div>
      <div className="grid grid-cols-3 border-l-2 border-l-gray-300">
        <div className="col-span-2 flex items-center text-center justify-center font-semibold">
          <div className="mr-4">{iconList[status]}</div>
          {status}
        </div>
        <div className="flex items-center text-center justify-center">
          <div className="mr-4">
            <FiEye color="gray" size={25} />
          </div>
          <div>
            <FiUpload color="gray" size={25} />
          </div>
        </div>
      </div>
    </div>
  );
}
