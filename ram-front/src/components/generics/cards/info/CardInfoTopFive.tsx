// (c) Delta Software 2023, rights reserved.
import { NumericFormat } from "react-number-format";

export interface CardInfoTopFiveProps {
  assuranceName: string;
  color: "blue" | "orange";
  top: {
    name: string;
    amount: number;
  }[];
}

export default function CardInfoTopFive({
  assuranceName,
  color,
  top,
}: CardInfoTopFiveProps): JSX.Element {
  const colorOptions = {
    blue: "text-gnp-blue-500",
    orange: "text-gnp-orange-500",
  };
  return (
    <div className="mt-3 h-full w-full items-center justify-center rounded-xl bg-gnp-white">
      <h1 className=" text-center text-2xl font-bold text-black">
        {assuranceName}
      </h1>
      <h2 className="mt-2 text-center text-xs font-bold text-gnp-gray-black">
        Top 5 vendedores por monto acumulado:
      </h2>
      <div className="mx-auto mt-2 flex w-10/12 flex-col items-center justify-center text-sm">
        {top.map((item, index) => (
          <div key={index} className="flex w-full justify-between">
            <div className={`font-bold ${colorOptions[color]}`}>
              {index + 1}.-
            </div>
            <div>{item.name}</div>
            <div className={`font-bold ${colorOptions[color]}`}>
              <NumericFormat
                value={item.amount}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
              MXN
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
