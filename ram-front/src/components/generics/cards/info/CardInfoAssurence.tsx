// (c) Delta Software 2023, rights reserved.

import { FaWallet } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

export interface ICardInfoAssuranceProps {
  typeAssurance: string;
  total: number;
  color: "blue" | "orange";
}

function CardInfoAssurence({
  typeAssurance,
  total,
  color,
}: ICardInfoAssuranceProps): JSX.Element {
  const colorOptions = {
    blue: { icon: "fill-gnp-blue-500", text: "text-gnp-blue-500" },
    orange: { icon: "fill-gnp-orange-500", text: "text-gnp-orange-500" },
  };

  return (
    <div className="mt-3 h-full w-full items-center justify-center rounded rounded-xl bg-gnp-white">
      <h1 className=" text-center text-2xl font-bold text-black w-10/12 mx-auto">
        {typeAssurance}
      </h1>
      <h2 className="text-center mt-2 font-bold text-md text-gnp-gray-black ">
        Monto Total Vendido:
      </h2>
      <div className="flex items-center justify-center mt-3">
        <FaWallet
          size={25}
          className={`${colorOptions[color]["icon"]} mt-2 mr-4`}
        />
        <h3
          className={`text-center mt-2 font-bold text-lg ${colorOptions[color]["text"]}`}
        >
          <NumericFormat
            value={total}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
          />{" "}
          <strong>MXN</strong>
        </h3>
      </div>
    </div>
  );
}

export default CardInfoAssurence;
