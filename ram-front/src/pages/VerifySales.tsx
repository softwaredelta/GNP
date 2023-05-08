// (c) Delta Software 2023, rights reserved.

import {
  AssuranceType,
  User,
  VerifySalesTable,
} from "../components/sales/VerifySalesTable";
import useAxios from "../hooks/useAxios";
import Wrapper from "../containers/Wrapper";
import { IListSalesProps } from "../components/sales/SalesTable";

export default function VerifySales() {
  const { response, error, loading } = useAxios<{
    sales: {
      id: string;
      policyNumber: string;
      assuranceType: AssuranceType;
      sellDate: Date;
      amountInCents: string;
      clientName: string;
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
      <Wrapper>
        <div>
          <div className="flex w-full items-center justify-start pt-8">
            <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
              Verificar ventas
            </h1>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center">
            {response && <VerifySalesTable sales={response.sales} />}
          </div>
        </div>
      </Wrapper>
    </>
  );
}
