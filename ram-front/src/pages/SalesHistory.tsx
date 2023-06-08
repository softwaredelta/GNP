// (c) Delta Software 2023, rights reserved.

import { SalesTable } from "../components/sales/SalesTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { ISell } from "../types";

export default function SalesHistory() {
  const { response: sales, callback: updateSales } = useAxios<ISell[]>({
    url: "sales/my-sales",
    method: "GET",
  });

  return (
    <Wrapper title="Mis ventas">
      <div>
        <div className="mt-3 flex flex-col items-center justify-center">
          {sales && <SalesTable sales={sales} updateSales={updateSales} />}
        </div>
      </div>
    </Wrapper>
  );
}
