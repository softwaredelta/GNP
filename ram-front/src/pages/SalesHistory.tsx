// (c) Delta Software 2023, rights reserved.

import { SalesTable } from "../components/sales/SalesTable";
import Wrapper from "../containers/Wrapper";
import { allSales$, useUpdateSales } from "../lib/api/api-sales";
import { useRecoilValue } from "recoil";

export default function SalesHistory() {
  const sales = useRecoilValue(allSales$);
  const updateSales = useUpdateSales();

  return (
    <Wrapper title="Mis ventas">
      <div>
        <div className="mt-3 flex flex-col items-center justify-center">
          <SalesTable sales={sales} onDeleted={() => updateSales()} />
        </div>
      </div>
    </Wrapper>
  );
}
