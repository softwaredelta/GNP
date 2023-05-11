
import Wrapper from "../containers/Wrapper";
import FunnelProspects from "../components/prospects/Funnel";
import { useRecoilValue } from "recoil";

export default function SalesHistory() {
//   const sales = useRecoilValue(allSales$);
//   const updateSales = useUpdateSales();

  return (
    <Wrapper>
      <div>
        <div className="flex w-full items-center justify-start pt-8">
          <h1 className=" rounded-r-2xl bg-gnp-orange-500 py-3 px-20 text-xl font-bold text-white">
            Prospectos
          </h1>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center">
          {/* <SalesTable sales={sales} onDeleted={() => updateSales()} /> */}
            <FunnelProspects></FunnelProspects>
        </div>
      </div>
    </Wrapper>
  );
}