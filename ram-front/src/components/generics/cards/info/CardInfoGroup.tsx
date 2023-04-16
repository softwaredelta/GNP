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
    <div className=" grid grid-cols-1 grid-rows-2 h-full w-full">
      <div className="w-full h-full flex items-center">
        <h1 className="font-bold text-lg">{nameGroup}</h1>
      </div>
      <div className="w-11/12 flex items-center mx-auto">
        <div className="w-full">
          <ProgressBar progress={progress} color={color} />
        </div>
      </div>
    </div>
  );
}
