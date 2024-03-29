// (c) Delta Software 2023, rights reserved.
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import LineGraph from "../components/graphs/LineGraph";
import ProspectsChart from "../components/graphs/ProspectChart";
import GroupProgress from "../components/metrics/GroupProgress";
import ProfileMetrics from "../components/metrics/ProfileMetrics";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IGroup, IProspectStatus, IUser } from "../types";
interface IResult {
  key: string;
  totalPaidFee: string;
}
interface IMonth {
  initialMonth: number;
  results: IResult[];
}
interface ILineData {
  sales: IMonth[];
  pieChart: IResult[];
}

export default function Metrics(): JSX.Element {
  const [pieData, setPieData] = useState<number[]>();
  const [lineData, setLineData] = useState<number[][]>();
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [assuranceTypeKey, setAssuranceTypeKey] = useState<string[]>([]);

  const { id } = useParams<{ id: string }>();
  const {
    response: dataGroups,
    loading: loadingGroups,
    error: groupsError,
  } = useAxios<{
    data: {
      groups: {
        group: IGroup;
        numberOfDeliveries: number;
        totalDeliveries: number;
        agent: number;
        agentTotalDeliveries: number;
        agentNumberOfDeliveries: number;
      }[];
    };
  }>({
    url: `groups/user-groups/${id}`,
    method: "GET",
  });

  const {
    response: user,
    loading: userLoading,
    error: userError,
  } = useAxios<IUser>({
    url: `user/${id}`,
    method: "GET",
  });

  const { response: prospectsStatus } = useAxios<IProspectStatus>({
    url: `status-prospect/status-by-agents/${id}`,
    method: "GET",
  });

  const { response: dataLine } = useAxios<ILineData>({
    url: `sales/line-graph/${id}`,
    method: "GET",
  });

  const { response: dataLineUpdated, callback: callbackLine } =
    useAxios<ILineData>({
      url: `sales/filters/line-graph/${id}`,
      method: "POST",
    });

  let finalTotalDeliveries = 0;
  let finalNumberOfDeliveries = 0;

  if (dataGroups && dataGroups.data.groups.length > 0) {
    const pos = dataGroups.data.groups.length - 1;
    finalTotalDeliveries = dataGroups.data.groups[pos].agentTotalDeliveries;
    finalNumberOfDeliveries =
      dataGroups?.data.groups[pos].agentNumberOfDeliveries;
  }

  function getPieGraph(data: IResult[]) {
    const dataArray: number[] = [];
    for (let i = 0; i < 5; i++) {
      if (data.length > 0) {
        dataArray.push(parseFloat(data[i].totalPaidFee));
      } else {
        dataArray.push(0);
      }
    }
    setPieData(dataArray);
  }

  function getLineGraph(dataLineGraph: ILineData, start: Date, end: Date) {
    const dataArray: number[][] = [];
    const keyArray: string[] = [];
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    const startMonth2 = start.getMonth();
    const endMonth2 = end.getMonth();
    const diffYears = endYear - startYear;
    const diffMonths = endMonth2 - startMonth2;
    const month = diffYears * 12 + diffMonths + 1;

    for (let i = 0; i < month; i++) {
      const innerArray: number[] = [];
      for (let j = 0; j < 5; j++) {
        if (dataLineGraph.sales[i]?.results.length > 0) {
          innerArray.push(
            parseFloat(dataLineGraph.sales[i].results[j]?.totalPaidFee) || 0,
          );
        } else {
          innerArray.push(0);
        }
      }
      dataArray.push(innerArray);
    }

    for (let i = 0; i < 5; i++) {
      keyArray.push(dataLineGraph.sales[0]?.results[i]?.key || "");
    }

    const invertedArray: number[][] = [];
    for (let i = 0; i < dataArray[0].length; i++) {
      invertedArray.push([]);

      for (let j = 0; j < dataArray.length; j++) {
        invertedArray[i].push(dataArray[j][i]);
      }
    }
    getPieGraph(dataLineGraph.pieChart);
    setLineData(invertedArray);
    setAssuranceTypeKey(keyArray);
  }

  function getTotals(totalsData: number[][]) {
    const totals: number[] = [];
    for (let i = 0; i < totalsData.length; i++) {
      let total = 0;
      for (let j = 0; j < totalsData[i].length; j++) {
        total += totalsData[i][j];
      }
      totals.push(total);
    }
    return totals;
  }

  useEffect(() => {
    if (dataLine) getLineGraph(dataLine, startDate, endDate);
    if (dataLineUpdated) getLineGraph(dataLineUpdated, startDate, endDate);
  }, [dataLine, dataLineUpdated]);

  if (loadingGroups || userLoading) return <h1>Loading ...</h1>;
  if (groupsError || userError) return <h1>Error ...</h1>;

  return (
    <Wrapper title={`Resumen de: ${user?.name} ${user?.lastName}`}>
      <div className="grid w-full grid-cols-2 grid-rows-2 gap-10 px-10 pt-6">
        <div className="relative w-full rounded-xl bg-slate-200 p-12">
          <div className="absolute -top-5 left-0 right-0 col-span-1 grid justify-center">
            <h1 className="rounded-3xl border border-solid border-slate-600 bg-slate-100 p-2 px-8 text-center text-2xl font-bold">
              Perfil
            </h1>
          </div>
          {user ? (
            <ProfileMetrics user={user} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">
                Algo salió mal
              </h1>
            </div>
          )}
        </div>
        <div className="relative w-full rounded-xl bg-slate-200 p-12 py-6">
          <div className="absolute -top-5 left-0 right-0 col-span-1 grid justify-center">
            <h1 className="rounded-3xl border border-solid border-slate-600 bg-slate-100 p-2 px-8 text-center text-2xl font-bold">
              Ventas
            </h1>
          </div>
          {lineData && pieData ? (
            <>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <DatePicker
                    selected={startDate}
                    name="datePicker"
                    id="datePicker"
                    onChange={(date: Date) => setStartDate(date)}
                    dateFormat="MM/yyyy"
                    className="input-primary w-full"
                    placeholderText="mm/aaaa"
                    required
                  />
                </div>
                <div>
                  <DatePicker
                    selected={endDate}
                    name="datePicker"
                    id="datePicker"
                    onChange={(date: Date) => setEndDate(date)}
                    dateFormat="MM/yyyy"
                    className="input-primary w-full"
                    placeholderText="mm/aaaa"
                    minDate={startDate}
                    required
                  />
                </div>
                <div>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      callbackLine({
                        initialDate: startDate,
                        finalDate: endDate,
                      });
                      setStartDate(new Date(startDate));
                      setEndDate(new Date(endDate));
                    }}
                  >
                    {" "}
                    Filtrar{" "}
                  </button>
                </div>
              </div>

              <LineGraph
                data={lineData}
                dataPie={getTotals(lineData)}
                start={startDate}
                end={endDate}
                dataKey={assuranceTypeKey}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">
                El agente {user?.name} {user?.lastName} no tiene ventas
                registrados.
              </h1>
              <p className="text-center text-lg text-gray-500">
                Cuando {user?.name} registre <strong>ventas</strong>, se podrán
                visualizar sus <strong>métricas</strong>.
              </p>
            </div>
          )}
        </div>
        <div className="relative w-full rounded-xl bg-slate-200 p-12 py-6">
          <div className="absolute -top-5 left-0 right-0 col-span-1 grid justify-center">
            <h1 className="rounded-3xl border border-solid border-slate-600 bg-slate-100 p-2 px-8 text-center text-2xl font-bold">
              Prospectos
            </h1>
          </div>
          {prospectsStatus &&
          Object.values(prospectsStatus).reduce((a, b) => a + b, 0) !== 0 ? (
            <ProspectsChart prospectInfo={prospectsStatus} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">
                El agente {user?.name} {user?.lastName} no tiene prospectos
                registrados.
              </h1>
              <p className="text-center text-lg text-gray-500">
                Cuando {user?.name} registre <strong>prospectos</strong>, se
                podrán visualizar sus <strong>métricas</strong>.
              </p>
            </div>
          )}
        </div>
        <div className="relative w-full rounded-xl bg-slate-200 p-12">
          <div className="absolute -top-5 left-0 right-0 col-span-1 grid justify-center">
            <h1 className="rounded-3xl border border-solid border-slate-600 bg-slate-100 p-2 px-8 text-center text-2xl font-bold">
              Grupos
            </h1>
          </div>
          {dataGroups && dataGroups.data.groups.length > 0 ? (
            <GroupProgress
              finalNumberOfDeliveries={finalNumberOfDeliveries}
              finalTotalDeliveries={finalTotalDeliveries}
              data={dataGroups.data}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">
                El agente {user?.name} {user?.lastName} no tiene grupos
                asignados.
              </h1>
              <p className="text-center text-lg text-gray-500">
                Asigne a {user?.name} en un un grupo para poder visualizar sus
                métricas.
              </p>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
