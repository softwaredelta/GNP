// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=957708639
// * M1_S01

import ProgressBar from "../../ProgressBar";

export interface ICardInfoGroupProps {
  nameGroup: string;
  progress: number;
  color: "blue" | "orange";
}

export default function CardInfoGroup({
  nameGroup,
  progress,
  color,
}: ICardInfoGroupProps): JSX.Element {
  return (
    <div className=" grid h-full w-full grid-cols-1 grid-rows-2">
      <div className="flex h-full w-full items-center">
        <h1 className="text-lg font-bold">{nameGroup}</h1>
      </div>
      <div className="mx-auto flex w-11/12 items-center">
        <div className="w-full">
          <ProgressBar progress={progress} color={color} />
        </div>
      </div>
    </div>
  );
}
