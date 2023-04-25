// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import CardNewSale from "../components/sales/CardNewSale";
import { allAssuranceTypes$ } from "../lib/api/api-assurance-type";
import { useRecoilValue } from "recoil";

export default function NewSale() {
  const assuranceTypes = useRecoilValue(allAssuranceTypes$);
  return (
    <Wrapper>
      <div className="flex flex-col justify-center items-center pt-8">
        <CardNewSale assuranceTypes={assuranceTypes.assuranceTypes} />
      </div>
    </Wrapper>
  );
}
