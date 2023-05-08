// (c) Delta Software 2023, rights reserved.

import { FaWallet } from "react-icons/fa";
import { NumericFormat } from "react-number-format";

export interface ICardInfoAssuranceProps {
  total: number;
  color: "blue" | "orange";
  assuranceName: string;
}

function CardInfoAssurence({
  total,
  color,
  assuranceName,
}: ICardInfoAssuranceProps): JSX.Element {
  const colorOptions = {
    blue: { icon: "fill-gnp-blue-500", text: "text-gnp-blue-500" },
    orange: { icon: "fill-gnp-orange-500", text: "text-gnp-orange-500" },
  };

  return (
    <div className="mt-3 h-full w-full items-center justify-center rounded-xl bg-gnp-white">
      <h1 className=" mx-auto w-10/12 text-center text-2xl font-bold text-black">
        {assuranceName}
      </h1>
      <h2 className="text-md mt-2 text-center font-bold text-gnp-gray-black ">
        Monto Total Vendido:
      </h2>
      <div className="mt-3 flex items-center justify-center">
        <FaWallet
          size={25}
          className={`${colorOptions[color].icon} mt-2 mr-4`}
        />
        <h3
          className={`mt-2 text-center text-lg font-bold ${colorOptions[color].text}`}
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
