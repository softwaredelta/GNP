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
        <div className="flex w-full items-center justify-start pt-8">
          <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
            Mis ventas
          </h1>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center">
          <SalesTable sales={sales} onDeleted={() => updateSales()} />
        </div>
      </div>
    </Wrapper>
  );
}
