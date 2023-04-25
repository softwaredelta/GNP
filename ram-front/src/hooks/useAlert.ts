// (c) Delta Software 2023, rights reserved.

import { useRecoilCallback, useRecoilValue } from "recoil";
import { type IAlert } from "../recoil/visual";
import { alerts$ } from "../recoil/visual/atoms";

export interface IUseAlertReturn {
  showAlert: (state: IAlert, seconds: number) => void;
  closeAlert: (id: string) => void;
  alerts: IAlert[];
}

export default function useAlert(): IUseAlertReturn {
  const closeAlert = useRecoilCallback(({ set }) => (id: string) => {
    console.info("closeAlert", id);
    set(alerts$, (alerts) => alerts.filter((alert) => alert.id !== id));
  });

  const showAlert = useRecoilCallback(
    ({ set }) =>
      (alert: IAlert, seconds: number) => {
        const id = Math.random().toString(36).substr(2, 9);
        set(alerts$, (alerts) => [...alerts, { ...alert, id }]);

        const timeoutMs = seconds * 1000;
        setTimeout(() => {
          closeAlert(id);
        }, timeoutMs);
      },
  );

  const alerts = useRecoilValue(alerts$);

  return { showAlert, closeAlert, alerts };
}
