// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import CardModifySale from "../components/sales/CardModifySale";
import { allAssuranceTypes$ } from "../lib/api/api-assurance-type";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { ISell } from "../types";

export default function NewSale() {
  const assuranceTypes = useRecoilValue(allAssuranceTypes$);
  const { id: idSale } = useParams();
  const {
    response: sale
  } = useAxios<ISell>({
    url: `sales/${idSale}`,
    method: "GET",
  });

  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center pt-8">
        {sale && <CardModifySale sale={sale} assuranceTypes={assuranceTypes} />}
      </div>
    </Wrapper>
  );
}
