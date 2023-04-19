// (c) Delta Software 2023, rights reserved.

import { BsCheckCircleFill, BsFillInfoCircleFill } from "react-icons/bs";
import { ImWarning } from "react-icons/im";
import { MdError } from "react-icons/md";

import ReactDOM from "react-dom";

export interface IAlertProps {
  type: "success" | "error" | "warning" | "info";
  message?: string;
  description?: string;
}

const ALERT_OPTIONS = {
  success: {
    icon: <BsCheckCircleFill size={25} />,
    color: "bg-green-500",
  },
  error: {
    icon: <MdError size={25} />,
    color: "bg-red-500",
  },
  warning: {
    icon: <ImWarning size={25} />,
    color: "bg-yellow-500",
  },
  info: {
    icon: <BsFillInfoCircleFill size={25} />,
    color: "bg-blue-500",
  },
};
export default function Alert({ type, message, description }: IAlertProps) {
  return ReactDOM.createPortal(
    <div
      className={`fixed top-0 right-0 ${ALERT_OPTIONS[type].color} max-w-sm text-white py-4 px-5 mt-10`}
    >
      <div className="grid grid-cols-5 place-items-center">
        <div className="">{ALERT_OPTIONS[type].icon}</div>
        <h2 className="col-span-4 text-xl w-full font-bold text-center">
          {message}
        </h2>
        <div className="col-span-5">
          <p className="text-sm font-medium p-2">{description}</p>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root") as HTMLElement,
  );
}
