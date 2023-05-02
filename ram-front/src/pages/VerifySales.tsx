// (c) Delta Software 2023, rights reserved.

import { AssuranceType, User, VerifySalesTable } from "../components/sales/VerifySalesTable";
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

  if (error) {
    console.log("error", error);
    throw error;
  }
  // const sales = useRecoilValue(verifySales$);
  console.log("response", response);
  return (
    <>
      <Wrapper>
        <div>
          <div className="w-full flex items-center justify-start pt-8">
            <h1 className=" font-bold py-3 px-20 bg-gnp-orange-500 text-white text-xl rounded-r-2xl">
              Verificar ventas
            </h1>
          </div>
          <div className="flex flex-col mt-8 justify-center items-center">
            {response && <VerifySalesTable sales={response.sales} />}
          </div>
        </div>
      </Wrapper>
    </>
  );
}
