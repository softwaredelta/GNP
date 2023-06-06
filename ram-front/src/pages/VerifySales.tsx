// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1338476890
// * M2_S04
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=224223021
// * M2_S05
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1535256513
// * M2_S07

import { Tabs } from "flowbite-react";
import { VerifySalesTable } from "../components/sales/VerifySalesTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { ISell } from "../types";

export default function VerifySales() {
  const {
    response: pendingResponse,
    loading: loadingResponse,
    callback: updatePendingSales,
  } = useAxios<{
    sales: ISell[];
  }>({
    url: `sales/verify-sales/pending`,
    method: "GET",
  });
  const {
    response: verifiedResponse,
    loading: loadingVerified,
    callback: updatedVerifiedSales,
  } = useAxios<{
    sales: ISell[];
  }>({
    url: `sales/verify-sales/aproved`,
    method: "GET",
  });
  const {
    response: refusedResponse,
    loading: loadingRefused,
    callback: updatedRefusedSales,
  } = useAxios<{
    sales: ISell[];
  }>({
    url: `sales/verify-sales/refused`,
    method: "GET",
  });

  const handleUpdate = () => {
    updatePendingSales();
    updatedVerifiedSales();
    updatedRefusedSales();
  };

  if (loadingResponse) return <h1>Loading...</h1>;
  if (loadingVerified) return <h1>Loading...</h1>;
  if (loadingRefused) return <h1>Loading...</h1>;

  return (
    <>
      <Wrapper title="Ventas">
        <Tabs.Group
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
        </Tabs.Group>
      </Wrapper>
    </>
  );
}
