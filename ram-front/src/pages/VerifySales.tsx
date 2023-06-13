// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1338476890
// * M2_S04
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=224223021
// * M2_S05
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1535256513
// * M2_S07

import { VerifySalesTable } from "../components/sales/VerifySalesTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IAssuranceType, ISell, IUser } from "../types";
import { useEffect } from "react";

export default function VerifySales() {
  const { response: sales, callback: updateSales } = useAxios<ISell[]>({
    url: "sales/all",
    method: "POST",
    body: { userId: "" },
  });

  const { response: agents } = useAxios<IUser[]>({
    url: "user/all-agents",
    method: "GET",
  });

  const { response: assuranceTypes } = useAxios<IAssuranceType[]>({
    url: "assurance-types/all",
    method: "GET",
  });

  useEffect(() => {
    if (!sales) updateSales();
  }, [sales, updateSales]);

  return (
    <>
      <Wrapper title="Ventas">
        <div>
          {sales && agents && assuranceTypes && (
            <VerifySalesTable
              sales={sales}
              updateSales={updateSales}
              agents={agents}
              assuranceTypes={assuranceTypes}
            />
          )}
        </div>
      </Wrapper>
    </>
  );
}
