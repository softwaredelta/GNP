// (c) Delta Software 2023, rights reserved.
import { useParams } from "react-router-dom";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IGroup, IUser } from "../types";
import GroupProgress from "../components/metrics/GroupProgress";

export default function Metrics(): JSX.Element {
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

  let finalTotalDeliveries = 0;
  let finalNumberOfDeliveries = 0;

  if (dataGroups && dataGroups.data.groups.length > 0) {
    const pos = dataGroups.data.groups.length - 1;
    finalTotalDeliveries = dataGroups.data.groups[pos].agentTotalDeliveries;
    finalNumberOfDeliveries =
      dataGroups?.data.groups[pos].agentNumberOfDeliveries;
  }

  if (loadingGroups || userLoading) return <h1>Loading ...</h1>;
  if (groupsError || userError) return <h1>Error ...</h1>;

  return (
    <Wrapper title={`Resumen de: ${user?.name} ${user?.lastName}`}>
      <div className="grid w-full grid-cols-2 grid-rows-2 gap-10 px-10 pt-6">
        <div className="w-full rounded-xl bg-slate-200 p-12 py-6"></div>
        <div className="relative w-full rounded-xl bg-slate-200 p-12 py-6">
          <div className="absolute -top-5 left-0 right-0 col-span-1 grid justify-center">
            <h1 className="rounded-3xl border border-solid border-slate-600 bg-slate-100 p-2 px-8 text-center text-2xl font-bold">
              Ventas
            </h1>
          </div>
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
