// (c) Delta Software 2023, rights reserved.

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
        {/* <Tabs.Group
          aria-label="Default tabs"
          className="px-8 py-4"
          style="default"
        >
          <Tabs.Item active={true} title="Sin Revisar">
            <div className="mt-1 flex items-center justify-center">
              {pendingResponse && (
                <VerifySalesTable
                  sales={pendingResponse.sales}
                  onUpdatedVerifySales={handleUpdate}
                />
              )}
            </div>
          </Tabs.Item>
          <Tabs.Item title="Revisados">
            {verifiedResponse && (
              <VerifySalesTable
                sales={verifiedResponse.sales}
                onUpdatedVerifySales={handleUpdate}
              />
            )}
          </Tabs.Item>
          <Tabs.Item title="Rechazados">
            {refusedResponse && (
              <VerifySalesTable
                sales={refusedResponse.sales}
                onUpdatedVerifySales={handleUpdate}
              />
            )}
          </Tabs.Item>
        </Tabs.Group> */}
      </Wrapper>
    </>
  );
}
