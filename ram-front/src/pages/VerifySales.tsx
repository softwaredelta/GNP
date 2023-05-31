// (c) Delta Software 2023, rights reserved.

import { Tabs } from "flowbite-react";
import { VerifySalesTable } from "../components/sales/VerifySalesTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { ISell } from "../types";

export default function VerifySales() {
  const {
    response: pendingResponse,
    loading: loadingResponse,
    callback: pendingSales,
  } = useAxios<{
    sales: ISell[];
  }>({
    url: `sales/verify-sales/pending`,
    method: "GET",
  });
  const {
    response: verifiedResponse,
    loading: loadingVerified,
    callback: aprovedSales,
  } = useAxios<{
    sales: ISell[];
  }>({
    url: `sales/verify-sales/aproved`,
    method: "GET",
  });
  const {
    response: refusedResponse,
    loading: loadingRefused,
    callback: refusedSales,
  } = useAxios<{
    sales: ISell[];
  }>({
    url: `sales/verify-sales/refused`,
    method: "GET",
  });

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
                <VerifySalesTable sales={pendingResponse.sales} />
              )}
            </div>
          </Tabs.Item>
          <Tabs.Item title="Revisados">
            {verifiedResponse && (
              <VerifySalesTable sales={verifiedResponse.sales} />
            )}
          </Tabs.Item>
          <Tabs.Item title="Rechazados">
            {refusedResponse && (
              <VerifySalesTable sales={refusedResponse.sales} />
            )}
          </Tabs.Item>
        </Tabs.Group>
      </Wrapper>
    </>
  );
}
