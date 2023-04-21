// (c) Delta Software 2023, rights reserved.

import {
  BsSendPlus,
  BsSend,
  BsSendExclamation,
  BsSendCheck,
  BsFillPeopleFill,
} from "react-icons/bs";

export interface DeliveryCardProps {
  membersNumber: number;
}

const iconList = {
  "Sin enviar": <BsSendPlus color="gray" size={25} />,
  Enviado: <BsSend color="#197492" size={25} />,
  Rechazado: <BsSendExclamation color="#c22f0e" size={25} />,
  Aceptado: <BsSendCheck color="green" size={25} />,
};

export default function ManagerDelivery({
  membersNumber,
}: DeliveryCardProps): JSX.Element {
  const colorOptions = {
    blue: "bg-gnp-blue-500",
    orange: "bg-gnp-orange-500",
  };
  return (
    <div className="border-l-2 border-l-gray-300 flex items-center text-center justify-end  font-medium text-gnp-gray-black px-16">
      <button
        className="hover:scale-110gi transition-all ease-in-out cursor-pointer"
        onClick={() => alert("Redireccionando a editar curso ...")}
      >
        <div className="w-full flex items-center text-center justify-end">
          <div className="p-2">
          <BsFillPeopleFill color="gray" size={20} />
          </div>
        {membersNumber} Miembros
        </div>
      </button>
    </div>
  );
}
