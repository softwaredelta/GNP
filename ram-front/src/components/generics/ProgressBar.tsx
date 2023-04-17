// (c) Delta Software 2023, rights reserved.

export interface IProgressBarProps {
  progress: number;
  textLabel?: string;
  color: "blue" | "orange";
}

export default function ProgressBar({
  progress,
  textLabel,
  color,
}: IProgressBarProps): JSX.Element {
  const colorOptions = {
    blue: {
      label: "text-gnp-blue-500",
      back: "bg-gnp-blue-500",
      progress: "bg-gnp-blue-700",
    },
    orange: {
      label: "text-gnp-orange-500",
      back: "bg-gnp-orange-500",
      progress: "bg-gnp-orange-700",
    },
  };
  return (
    <div>
      <div className={`text-xs font-semibold  ${colorOptions[color].label}`}>
        {textLabel}
      </div>
      <div
        className={`rounded-full w-full  bg-opacity-50 ${colorOptions[color].back}`}
      >
        <div
          style={{ width: `${progress}%` }}
          className={`text-xs font-bold text-white ${colorOptions[color].progress} text-center p-0.5 rounded-full`}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
}
