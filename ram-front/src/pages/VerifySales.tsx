// (c) Delta Software 2023, rights reserved.

import React from "react";
import { VerifySalesTable } from "../components/sales/VerifySalesTable";
import Wrapper from "../containers/Wrapper";
import { verifySales$, useUpdateVerifiedSales } from "../lib/api/api-sales";
import { useRecoilValue } from "recoil";

export default function VerifySales() {
  const sales = useRecoilValue(verifySales$);
  const updateSales = useUpdateVerifiedSales();
  return (
    <>
      <div>
        <Wrapper>
          <div>
            <div className="w-full flex items-center justify-start pt-8">
              <h1 className=" font-bold py-3 px-20 bg-gnp-orange-500 text-white text-xl rounded-r-2xl">
                Verificar ventas
              </h1>
            </div>
            <div className="flex flex-col mt-8 justify-center items-center">
              <VerifySalesTable
                sales={sales.sales}
                onUpdated={() => updateSales()}
              />
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
}
