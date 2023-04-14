import React from "react";
import { Progress } from "flowbite-react";

export interface IProgressBarProps {
  progress: number;
  textLabel?: string;
  bgColor?: string;
  color?: string;
  txColor: string;
}

export default function ProgressBar({
  progress,
  textLabel,
  bgColor,
  color,
  txColor,
}: IProgressBarProps): JSX.Element {

  return (
    <div>
      <div className={`text-xs font-semibold text-${color}`}>{textLabel}</div>
      <div className={`rounded-full w-full bg-${bgColor}  bg-opacity-50`}>
        <div
          style={{ width: `${progress}%` }}
          className={` bg-${color} text-xs font-bold text-${txColor} text-center p-0.5 rounded-full`}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
}
