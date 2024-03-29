// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=924979067
// * M2_S01

import Wrapper from "../containers/Wrapper";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { IAssuranceType } from "../types";
import SaleForm from "../components/forms/SaleForm";

export default function NewSale() {
  const { response: assuranceTypes } = useAxios<IAssuranceType[]>({
    url: "assurance-types/all",
    method: "GET",
  });
  const navigate = useNavigate();

  const { response, error, callback } = useAxios({
    url: `sales/create`,
    method: "POST",
  });

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "¡Éxito!",
        text: "La venta se ha registrado correctamente.",
        icon: "success",
      }).then(() => navigate("/sales-history"));
    } else if (error) {
      Swal.fire({
        title: "¡Error!",
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
        {assuranceTypes && (
          <SaleForm
            assuranceTypes={assuranceTypes}
            isEdit={false}
            handlePost={async ({
              emissionDate,
              file,
              form,
              paidDate,
            }): Promise<boolean> => {
              if (file && callback) {
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
                  const flag = await callback(formData);
                  return flag;
                } catch (err) {
                  Swal.fire({
                    title: "¡Error!",
                    text: `Ocurrió un error al registrar la venta.\n
                    ${(err as any).response.data.message}`,
                    icon: "error",
                    confirmButtonText: "OK",
                  });
                  return false;
                }
              } else {
                Swal.fire({
                  title: "¡Error!",
                  text: `No seleccionaste archivo.`,
                  icon: "error",
                  confirmButtonText: "OK",
                });
                return false;
              }
            }}
          />
        )}
      </div>
    </Wrapper>
  );
}
