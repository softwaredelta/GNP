// (c) Delta Software 2023, rights reserved.
import { FiUpload, FiEye } from "react-icons/fi";
import {
  BsSendPlus,
  BsSend,
  BsSendExclamation,
  BsSendCheck,
} from "react-icons/bs";

export interface AgentDeliveryProps {
  status: "Sin enviar" | "Enviado" | "Rechazado" | "Aceptado";
}

const iconList = {
  "Sin enviar": <BsSendPlus color="gray" size={25} />,
  Enviado: <BsSend color="#197492" size={25} />,
  Rechazado: <BsSendExclamation color="#c22f0e" size={25} />,
  Aceptado: <BsSendCheck color="green" size={25} />,
};

export default function AgentDelivery({
  status,
}: AgentDeliveryProps): JSX.Element {
  return (
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
  );
}
