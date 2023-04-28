// (c) Delta Software 2023, rights reserved.

import { BsFillPeopleFill } from "react-icons/bs";

export interface DeliveryCardProps {
  membersNumber: number;
}

export default function ManagerDelivery({
  membersNumber,
}: DeliveryCardProps): JSX.Element {
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
          {membersNumber} Entregas
        </div>
      </button>
    </div>
  );
}
