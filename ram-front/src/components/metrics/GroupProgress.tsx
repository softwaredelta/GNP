// (c) Delta Software 2023, rights reserved.

import { IGroup } from "../../types";
import ProgressBar from "../generics/ProgressBar";

export interface IProgressBarProps {
  finalNumberOfDeliveries: number;
  finalTotalDeliveries: number;
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
}

export default function Metrics({
  finalNumberOfDeliveries,
  finalTotalDeliveries,
  data,
}: IProgressBarProps): JSX.Element {
  return (
    <>
      <div className="w-full ">
        <div className="mx-auto w-10/12 pb-8">
          <div className="grid w-full grid-cols-3">
            <div className="col-span-2 grid justify-center pb-2 text-2xl font-semibold">
              Progreso General
            </div>
            <div className="grid justify-end pr-5 text-xl font-extralight ">
              {finalNumberOfDeliveries} / {finalTotalDeliveries} entregas
            </div>
          </div>
          <ProgressBar
            progress={
              ((Math.trunc(finalNumberOfDeliveries / finalTotalDeliveries) *
                100) as number) || 0
            }
            color={"orange"}
            height="10"
            fontSize={20}
            paddingTop={10}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-4">
        {data &&
          data.groups.map((group) => (
            <>
              <div className="rounded-xl border border-solid border-slate-600 bg-slate-300 p-4">
                <div className="grid w-full grid-cols-3">
                  <div className="col-span-2 grid justify-center font-semibold">
                    {group.group.name}
                  </div>
                  <div className="grid justify-end pr-5 font-extralight ">
                    {group.numberOfDeliveries} / {group.totalDeliveries}
                  </div>
                </div>
                <ProgressBar
                  color={"blue"}
                  progress={
                    ((Math.trunc(
                      group.numberOfDeliveries / group.totalDeliveries,
                    ) * 100) as number) || 0
                  }
                />
              </div>
            </>
          ))}
      </div>
    </>
  );
}
