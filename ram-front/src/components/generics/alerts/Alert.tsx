// (c) Delta Software 2023, rights reserved.

import { BsCheckCircleFill } from "react-icons/bs";
import ReactDOM from "react-dom";
import { IAlert } from "../../../recoil/visual";
import useAlert from "../../../hooks/useAlert";
import { AiOutlineClose } from "react-icons/ai";
import { FiAlertCircle } from "react-icons/fi";

const ALERT_OPTIONS = {
  success: {
    icon: <BsCheckCircleFill size={25} />,
    color: "bg-green-500",
  },
  error: {
    icon: <FiAlertCircle size={25} />,
    color: "bg-red-500",
  },
  warning: {
    icon: <FiAlertCircle size={25} />,
    color: "bg-yellow-500",
  },
  info: {
    icon: <FiAlertCircle size={25} />,
    color: "bg-blue-500",
  },
};

export function Alert({
  alert: { type, description, message },
  onClose,
}: {
  alert: IAlert;
  onClose: () => void;
}) {
  return (
    <div className={`${ALERT_OPTIONS[type].color} max-w-sm text-white`}>
      <div className="grid grid-cols-5 place-items-center p-3">
        <div className="col-span-1">{ALERT_OPTIONS[type].icon}</div>
        <h2 className="col-span-3 w-full text-center text-xl font-bold">
          {message}
        </h2>
        <button className="col-span-1 justify-self-end" onClick={onClose}>
          <AiOutlineClose
            size={20}
            className="fill-white transition-all ease-in-out hover:scale-125 hover:fill-gnp-orange-500 active:scale-90 "
          />
        </button>
        <div className="col-span-5">
          <p className="p-2 text-sm font-medium">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function AlertsContainer() {
  const { closeAlert, alerts } = useAlert();

  return ReactDOM.createPortal(
    <li className="fixed top-0 right-0 z-[90] mt-10 flex flex-col gap-4 py-4 px-5">
      {alerts.map(({ id, description, message, type }) => (
        <Alert
          key={id}
          onClose={() => {
            if (id) closeAlert(id);
          }}
          alert={{
            description,
            message,
            type,
          }}
        />
      ))}
    </li>,
    document.getElementById("alerts-root") as HTMLElement,
  );
}
