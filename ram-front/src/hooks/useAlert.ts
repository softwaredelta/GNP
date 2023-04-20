// (c) Delta Software 2023, rights reserved.

import { useSetRecoilState } from "recoil";
import atomAlert, { IAlert } from "../recoil/visual";

export interface IUseAlertReturn {
  showAlert: (state: IAlert, seconds: number) => void;
}

export default function useAlert(): IUseAlertReturn {
  const setState = useSetRecoilState(atomAlert);

  const showAlert = (state: IAlert, seconds: number) => {
    setState((prev) => ({ ...prev, isOpen: false }));
    setState({ ...state, isOpen: true });
    setTimeout(() => {
      setState((prev) => ({ ...prev, isOpen: false }));
    }, seconds * 1000);
  };

  return { showAlert };
}
