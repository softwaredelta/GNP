// (c) Delta Software 2023, rights reserved.

import { useRecoilState } from "recoil";
import { loading$ } from "../recoil/loader/atom";

export interface IUseLoader {
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

export default function useLoader(): IUseLoader {
  const [loading, setLoading] = useRecoilState<boolean>(loading$);

  return { loading, setLoading };
}
