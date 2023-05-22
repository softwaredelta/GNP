// (c) Delta Software 2023, rights reserved.

import {
  AssuranceType,
  User,
  VerifySalesTable,
} from "../components/sales/VerifySalesTable";
import useAxios from "../hooks/useAxios";
import Wrapper from "../containers/Wrapper";

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
        <div>
          <div className="mt-8 flex flex-col items-center justify-center">
            {response && <VerifySalesTable sales={response.sales} />}
          </div>
        </div>
      </Wrapper>
    </>
  );
}
