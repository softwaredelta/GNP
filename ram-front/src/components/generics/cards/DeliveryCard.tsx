// (c) Delta Software 2023, rights reserved.
import {
  BsSend,
  BsSendCheck,
  BsSendExclamation,
  BsSendPlus,
} from "react-icons/bs";
import { FiEye, FiUpload } from "react-icons/fi";
import { DeliveryStatus } from "../../../types";
import { useOpenFile } from "../../../lib/files";

export type Colors = "blue" | "orange";

export interface DeliveryCardProps {
  deliveryId: string;
  nameDelivery: string;
  image: string;
  onFileSubmit: (id: string) => void;
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
  deliveryId,
  nameDelivery,
  image,
  color,
  status,
  onFileSubmit,
  fileUrl,
}: DeliveryCardProps): JSX.Element {
  const colorOptions = {
    blue: "bg-gnp-blue-500",
    orange: "bg-gnp-orange-500",
  };

  const openFileInNewTab = useOpenFile();

  return (
    <div
      className="w-full grid grid-cols-2  rounded-b-lg overflow-hidden bg-gnp-white shadow-lg"
      role="delivery"
    >
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
          {fileUrl && "Sin enviar" !== status && (
            <button className="mr-4">
              <FiEye
                onClick={() => openFileInNewTab(fileUrl)}
                color="gray"
                size={25}
              />
            </button>
          )}

          {"Aceptado" !== status && (
            <button>
              <FiUpload
                color="gray"
                size={25}
                onClick={() => onFileSubmit(deliveryId)}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
