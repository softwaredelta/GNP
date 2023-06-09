// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=716285224
// * M5_S05
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=790712334
// * M5_S06

import { Table } from "flowbite-react";
import "react-datepicker/dist/react-datepicker.css";
import { RiFileExcel2Fill } from "react-icons/ri";
import useAxios from "../../hooks/useAxios";
import { IProspectStatus } from "../../types";

type Props = {
  id: string;
  link: string;
  name: string;
  lastName?: string;
  urlPP200?: string;
  handleOnClick?: (id: string) => void;
};

function calculateValues(
  prospectsStatus: IProspectStatus,
  citaAgendada: number,
) {
  const citaEfectiva = prospectsStatus?.["Cita efectiva"] ?? 0;
  const polizaPagada = prospectsStatus?.["Poliza pagada"] ?? 0;
  const solicitudSeguro = prospectsStatus?.["Solicitud de seguro"] ?? 0;

  const citaAgendadaTotal =
    citaAgendada + citaEfectiva + solicitudSeguro + polizaPagada;
  const citaEfectivaTotal = citaEfectiva + solicitudSeguro + polizaPagada;
  const solicitudSeguroTotal = solicitudSeguro + polizaPagada;

  return {
    citaAgendadaTotal,
    citaEfectivaTotal,
    solicitudSeguroTotal,
    polizaPagada,
  };
}

function getCellBackgroundColor(value: number, referenceValue: number) {
  return value > referenceValue ? "bg-[#28A954]" : "bg-[#E6003D]";
}

export default function FunnelRow({
  id,
  name,
  link,
  lastName,
  urlPP200,
  handleOnClick,
}: Props) {
  const { response: prospects } = useAxios<
    {
      count: number;
    }[]
  >({
    url: `status-prospect/count-new-prospects/${id}`,
    method: "GET",
  });

  const { response: prospectsStatus } = useAxios<IProspectStatus>({
    url: `status-prospect/status-by-agents/${id}`,
    method: "GET",
  });
  console.log(
    "🚀 ~ file: FunnelRow.tsx:68 ~ prospectsStatus:",
    prospectsStatus,
  );

  const prospectsCount = prospects?.[0]?.count ?? 0;
  const citaAgendada = prospectsStatus?.["Cita agendada"] ?? 0;

  const {
    citaAgendadaTotal,
    citaEfectivaTotal,
    solicitudSeguroTotal,
    polizaPagada,
  } = calculateValues(prospectsStatus as IProspectStatus, citaAgendada);

  return (
    <Table.Row
      onClick={() => handleOnClick && handleOnClick(id)}
      key={id}
      className="transitions-all bg-white ease-in-out hover:cursor-pointer hover:bg-gray-300  dark:border-gray-700 dark:bg-gray-800 "
    >
      <Table.Cell
        className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
        align="center"
      >
        {name} {lastName}
      </Table.Cell>
      <Table.Cell>
        <div
          className={`flex items-center justify-center rounded-full py-2 text-lg font-bold text-white ${getCellBackgroundColor(
            prospectsCount,
            30,
          )}`}
        >
          {prospectsCount}
        </div>
      </Table.Cell>
      <Table.Cell align="center">
        <div
          className={`flex items-center justify-center rounded-full py-2 text-lg font-bold text-white ${getCellBackgroundColor(
            citaAgendadaTotal,
            Number((prospectsCount * 0.48).toFixed(0)),
          )}`}
        >
          {" "}
          {citaAgendadaTotal}
        </div>
      </Table.Cell>
      <Table.Cell align="center">
        <div
          className={`flex items-center justify-center rounded-full py-2 text-lg font-bold text-white ${getCellBackgroundColor(
            citaEfectivaTotal,
            Number(((citaAgendada * 0.4) / 0.48).toFixed(0)),
          )}`}
        >
          {citaEfectivaTotal} / {((citaAgendada * 0.4) / 0.48).toFixed(0)}
        </div>
      </Table.Cell>
      <Table.Cell align="center">
        <div
          className={`flex items-center justify-center rounded-full py-2 text-lg font-bold text-white ${getCellBackgroundColor(
            solicitudSeguroTotal,
            Number(((citaAgendada * 0.08) / 0.48).toFixed(0)),
          )}`}
        >
          {solicitudSeguroTotal} / {((citaAgendada * 0.08) / 0.48).toFixed(0)}
        </div>
      </Table.Cell>
      <Table.Cell align="center">
        <div
          className={`flex items-center justify-center rounded-full py-2 text-lg font-bold text-white ${getCellBackgroundColor(
            polizaPagada,
            Number(((citaAgendada * 0.04) / 0.48).toFixed(0)),
          )}`}
        >
          {polizaPagada} / {((citaAgendada * 0.04) / 0.48).toFixed(0)}
        </div>
      </Table.Cell>
      <Table.Cell align="center">
        {urlPP200 ? (
          <RiFileExcel2Fill
            size={20}
            className="transition-all  duration-300 ease-in-out hover:scale-125 hover:fill-green-500"
            onClick={(event) => {
              event.stopPropagation();
              window.open(link, "_blank");
            }}
          />
        ) : (
          <button disabled>
            <RiFileExcel2Fill
              size={20}
              className="cursor-not-allowed"
              onClick={(event) => {
                event.stopPropagation();
              }}
            />
          </button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
