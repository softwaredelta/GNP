// (c) Delta Software 2023, rights reserved.

export interface IProgressBarProps {
  progress: number;
  textLabel?: string;
  color: "blue" | "orange";
  height?: string;
  fontSize?: number;
  paddingTop?: number;
}

export default function ProgressBar({
  progress,
  textLabel,
  color,
  height,
  fontSize,
  paddingTop,
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
        className={`h-${height} w-full rounded-full  bg-opacity-50 ${colorOptions[color].back}`}
      >
        <div
          style={{
            width: `${progress < 12 ? 12 : progress}%`,
            fontSize: fontSize,
            paddingTop: paddingTop,
          }}
          className={`h-${height} text-xs font-bold text-white ${colorOptions[color].progress} rounded-full p-0.5 text-center`}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
}
