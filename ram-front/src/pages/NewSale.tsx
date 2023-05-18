// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { allAssuranceTypes$ } from "../lib/api/api-assurance-type";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";
import SaleForm from "../components/forms/SaleForm";
import Swal from "sweetalert2";

export default function NewSale() {
  const assuranceTypes = useRecoilValue(allAssuranceTypes$);
  const navigate = useNavigate();

  const { response, error, callback } = useAxios({
    url: `sales/create`,
    method: "POST",
  });

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "La venta se ha registrado correctamente.",
        icon: "success",
      });
      navigate("/sales-history");
    } else if (error) {
      Swal.fire({
        title: "Error!",
        text: `Ocurrió un error al registrar la venta.\n
        ${(error as any).response.data.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [response, error, navigate]);

  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center pt-8">
        <SaleForm
          initialSell={{
            policyNumber: "",
            yearlyFee: "",
            contractingClient: "",
            status: "",
            periodicity: "",
            evidenceUrl: "",
            insuredCostumer: "",
            paidFee: "",
            assuranceTypeId: "",
          }}
          assuranceTypes={assuranceTypes}
          isEdit={false}
          handlePost={({ emissionDate, file, form, paidDate }) => {
            if (file) {
              const formData: FormData = new FormData();
              formData.append("file", file);
              formData.append("policyNumber", form.policyNumber.toString());
              formData.append(
                "assuranceTypeId",
                form.assuranceTypeId.toString(),
              );
              formData.append("paidDate", paidDate?.toString() as string);
              formData.append("yearlyFee", form.yearlyFee.toString());
              formData.append("contractingClient", form.contractingClient);
              formData.append("periodicity", form.periodicity);
              formData.append("paidFee", form.paidFee?.toString() as string);
              formData.append("insuredCostumer", form.insuredCostumer);
              formData.append(
                "emissionDate",
                emissionDate?.toString() as string,
              );
              try {
                callback?.(formData);
              } catch (err) {
                console.error(err);
              }
            } else {
              Swal.fire({
                title: "Error!",
                text: `No seleccionaste archivo.`,
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          }}
        />
      </div>
    </Wrapper>
  );
}

// import Wrapper from "../containers/Wrapper";
// import CardNewSale from "../components/sales/CardNewSale";
// import { allAssuranceTypes$ } from "../lib/api/api-assurance-type";
// import { useRecoilValue } from "recoil";

// export default function NewSale() {
//   const assuranceTypes = useRecoilValue(allAssuranceTypes$);
//   return (
//     <Wrapper>
//       <div className="flex flex-col items-center justify-center pt-8">
//         <CardNewSale assuranceTypes={assuranceTypes} />
//       </div>
//     </Wrapper>
//   );
// }
