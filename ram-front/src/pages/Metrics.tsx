// (c) Delta Software 2023, rights reserved.
import { useParams } from "react-router-dom";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IGroup, IUser } from "../types";
import GroupProgress from "../components/metrics/GroupProgress";
import { useState, useEffect } from "react";
import LineGraph from "../components/graphs/LineGraph";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProfileMetrics from "../components/metrics/ProfileMetrics";
interface IResult {
  key: string;
  totalPaidFee: number;
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
  const [startMonth, setStartMonth] = useState<number>(
    new Date().getMonth() - 2,
  );
  const [endMonth, setEndMonth] = useState<number>(new Date().getMonth());

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
        dataArray.push(data[i].totalPaidFee);
      } else {
        dataArray.push(0);
      }
    }
    setPieData(dataArray);
  }

  function getLineGraph(dataLineGraph: ILineData, start: number, end: number) {
    const dataArray = [];
    const month: number = end - start + 1;

    for (let i = 0; i < month; i++) {
      const innerArray = [];
      for (let j = 0; j < 5; j++) {
        if (dataLineGraph.sales[i]?.results.length > 0) {
          innerArray.push(dataLineGraph.sales[i].results[j]?.totalPaidFee || 0);
        } else {
          innerArray.push(0);
        }
      }
      dataArray.push(innerArray);
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
    console.log(totals);
    return totals;
  }

  useEffect(() => {
    if (dataLine) getLineGraph(dataLine, startMonth, endMonth);
    if (dataLineUpdated) getLineGraph(dataLineUpdated, startMonth, endMonth);
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
                  setStartMonth(new Date(startDate).getMonth());
                  setEndMonth(new Date(endDate).getMonth());
                }}
              >
                {" "}
                Filtrar{" "}
              </button>
            </div>
          </div>
          {lineData && pieData ? (
            <LineGraph
              data={lineData}
              dataPie={getTotals(lineData)}
              firstMonth={startMonth}
              lastMonth={endMonth}
            />
          ) : (
            <div> No hay datos </div>
          )}
        </div>
        <div className="relative w-full rounded-xl bg-slate-200 p-12 py-6">
          <div className="absolute -top-5 left-0 right-0 col-span-1 grid justify-center">
            <h1 className="rounded-3xl border border-solid border-slate-600 bg-slate-100 p-2 px-8 text-center text-2xl font-bold">
              Prospectos
            </h1>
          </div>
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
