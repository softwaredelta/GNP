// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1287058613
// * M1_S05

import { FiUsers } from "react-icons/fi";

export interface DeliveryCardProps {
  membersNumber: number;
}

export default function ManagerDelivery({
  membersNumber,
}: DeliveryCardProps): JSX.Element {
  return (
    <div className="flex items-center justify-end border-l-2 border-l-gray-300 px-16  text-center font-medium text-gnp-gray-black">
      <div className="flex w-full items-center justify-end text-center">
        <div className="p-2">
          <FiUsers color="gray" size={20} />
        </div>
        {membersNumber} Entregas
      </div>
    </div>
  );
}
