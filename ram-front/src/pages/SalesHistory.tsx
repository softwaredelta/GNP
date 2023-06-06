// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=832442920
// * M2_S02
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1423929641
// * M2_S03
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1535256513
// * M2_S07

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
