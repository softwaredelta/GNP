// (c) Delta Software 2023, rights reserved.

import { IStatus } from "../../types";
import ProspectListHistory from "./ProspectListHistory";

type Props = {
  History: IStatus[];
};

export default function ProspectsHistoryTable({ History }: Props) {
  if (history.length === 0) return <h1>No hay historial del prospecto</h1>;
  return (
    <div className="flex flex-col items-center justify-center pt-8">
      <>
        <div
          data-testid="prospect-list"
          className="flex items-center justify-end"
        >
          <div className="m-6">
            <div className="flex">
              <div className="w-3/3 flex items-center pr-40">
                <div className="rounded-md  bg-gnp-blue-500">
                  <p className="px-5 py-2 text-center font-semibold text-gray-500 text-white">
                    Estado
                  </p>
                </div>
              </div>
              <div className="w-3/3 px-19 flex items-center">
                <div className="rounded-md  bg-gnp-blue-500">
                  <p className="px-5 py-2 text-center font-semibold text-gray-500 text-white">
                    Comentario
                  </p>
                </div>
              </div>
              <div className="w-3/3 flex items-center pl-36">
                <div className="rounded-md  bg-gnp-blue-500">
                  <p className="px-5 py-2 text-center font-semibold text-gray-500 text-white">
                    Fecha de actualizacion de state
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-h-[26%] w-full justify-center gap-10">
          <div className="w-3/5">
            {History.map((h) => {
              return (
                <ProspectListHistory
                  key={h.id}
                  state={h.statusName}
                  comment={h.comments}
                  date={h.date}
                />
              );
            })}
          </div>
        </div>
      </>
    </div>
  );
}
