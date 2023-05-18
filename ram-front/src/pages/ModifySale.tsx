// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { allAssuranceTypes$ } from "../lib/api/api-assurance-type";
import { useRecoilValue } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { ISell } from "../types";
import { useEffect } from "react";
import SaleForm from "../components/forms/SaleForm";
import Swal from "sweetalert2";
import { useUrlFile } from "../lib/files";

export default function NewSale() {
  const assuranceTypes = useRecoilValue(allAssuranceTypes$);
  const { id: idSale } = useParams();
  const fileUrl = useUrlFile();
  const navigate = useNavigate();
  const { response: sale } = useAxios<ISell>({
    url: `sales/${idSale}`,
    method: "GET",
  });

  const { response, error, callback } = useAxios({
    url: `sales/update/${idSale}`,
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
        {sale && (
          <SaleForm
            initialSell={{
              ...sale,
              evidenceUrl: fileUrl(sale.evidenceUrl as string),
            }}
            assuranceTypes={assuranceTypes}
            isEdit={true}
            handlePost={({ emissionDate, file, form, paidDate }) => {
              if (file) {
                const formData: FormData = new FormData();

                if (typeof file === "string")
                  formData.append("evidenceUrl", file);
                else formData.append("file", file);

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
                for (const value of formData.values()) {
                  console.log(value);
                }
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
        )}
      </div>
    </Wrapper>
  );
}
