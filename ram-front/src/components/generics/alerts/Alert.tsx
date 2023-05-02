// (c) Delta Software 2023, rights reserved.

import { BsCheckCircleFill, BsFillInfoCircleFill } from "react-icons/bs";
import { ImWarning } from "react-icons/im";
import { MdError } from "react-icons/md";
import ReactDOM from "react-dom";
import { IAlert } from "../../../recoil/visual";
import useAlert from "../../../hooks/useAlert";
import { AiOutlineClose } from "react-icons/ai";

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
        <h2 className="col-span-3 text-xl w-full font-bold text-center">
          {message}
        </h2>
        <button className="col-span-1 justify-self-end" onClick={onClose}>
          <AiOutlineClose
            size={20}
            className="fill-white hover:fill-gnp-orange-500 hover:scale-125 active:scale-90 transition-all ease-in-out "
          />
        </button>
        <div className="col-span-5">
          <p className="text-sm font-medium p-2">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function AlertsContainer() {
  const { closeAlert, alerts } = useAlert();

  return ReactDOM.createPortal(
    <li className="flex flex-col gap-4 fixed z-[90] top-0 right-0 py-4 px-5 mt-10">
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
