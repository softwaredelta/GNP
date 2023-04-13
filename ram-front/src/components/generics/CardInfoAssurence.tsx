import React from "react";
import { BsHouses } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";

export interface ICardInfoAssuranceProps {
  title?: string;
  total?: number;
  icon?: React.ReactNode;
}

function CardInfoAssurence({
  title,
  total,
  icon,
}: ICardInfoAssuranceProps): JSX.Element {
  return (
    <div className="mt-3 h-full w-full items-center justify-center rounded rounded-xl bg-gnp-white">
      <h1 className=" text-center text-2xl font-bold text-black">
        Tipo de Seguro
      </h1>
      <h2 className="text-center mt-2 font-bold text-md text-gnp-gray-black">
        Monto Total Vendido:
      </h2>
      <div className="flex items-center justify-center mt-3">
        <FaWallet size={25} className="fill-gnp-primary-orange mt-2 mr-4" />
        <h3 className=" text-center mt-2 font-bold text-lg text-gnp-primary-orange">
          $1,000,000 <strong>MXN</strong>
        </h3>
      </div>
    </div>
  );
}

export default CardInfoAssurence;
