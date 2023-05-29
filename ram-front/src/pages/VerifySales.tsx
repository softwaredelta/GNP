// (c) Delta Software 2023, rights reserved.

import { Tabs } from "flowbite-react";
import {
  AssuranceType,
  User,
  VerifySalesTable,
} from "../components/sales/VerifySalesTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";

export default function VerifySales() {
  const { response, loading } = useAxios<{
    sales: {
      id: string;
      policyNumber: string;
      assuranceType: AssuranceType;
      paidDate: Date;
      yearlyFee: string;
      contractingClient: string;
      status: string;
      periodicity: string;
      user: User;
      evidenceUrl: string;
    }[];
  }>({
    url: `sales/verify-sales`,
    method: "GET",
  });

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <Wrapper title="Ventas">
        <Tabs.Group
          aria-label="Default tabs"
          className="px-8 pb-4"
          style="default"
        >
          <Tabs.Item active={true} title="Sin Revisar">
            <div>
              <div className="mt-8 flex flex-col items-center justify-center">
                {response && <VerifySalesTable sales={response.sales} />}
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Revisados">{/*  "Revisados" */}</Tabs.Item>
        </Tabs.Group>
      </Wrapper>
    </>
  );
}
