// (c) Delta Software 2023, rights reserved.

import { SalesTable } from "../components/sales/SalesTable";
import Wrapper from "../containers/Wrapper";
import { Pagination } from "flowbite-react";
import { allSales$, useUpdateSales } from "../lib/api/api-sales";
import { useRecoilValue } from "recoil";

export default function SalesHistory() {
  const sales = useRecoilValue(allSales$);
  const updateSales = useUpdateSales();

  return (
    <Wrapper>
      <div>
        <div className="w-full flex items-center justify-start pt-8">
          <h1 className=" font-bold py-3 px-20 bg-gnp-orange-500 text-white text-xl rounded-r-2xl">
            Mis ventas
          </h1>
        </div>
        <div className="flex flex-col mt-8 justify-center items-center">
          <SalesTable sales={sales} onDeleted={() => updateSales()} />
        </div>
      </div>
    </Wrapper>
  );
}
