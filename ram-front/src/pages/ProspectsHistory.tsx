// (c) Delta Software 2023, rights reserved.

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProspectsHistoryTable from "../components/prospects/ProspectHistoryTable";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IStatus, IStatusProspect } from "../types";

export interface History {
  history: IStatusProspect[];
  name: string;
}

export default function ProspectsHistory() {
  const { id: idProspect } = useParams();
  console.log("idProspect:", idProspect);

  const { response: historyStatus, error: errorStatus } = useAxios<IStatus[]>({
    url: `status-prospect/${idProspect}`,
    method: "GET",
  });
  console.log(
    "🚀 ~ file: ProspectsHistory.tsx:22 ~ ProspectsHistory ~ historyStatus:",
    historyStatus,
  );

  useEffect(() => {
    if (errorStatus) {
      console.log("Error :", errorStatus);
    }
  }, [historyStatus, errorStatus]);

  const [history, setHistory] = useState<Array<IStatus>>([]);
  useEffect(() => {
    if (historyStatus) {
      setHistory(historyStatus);
    }
  }, [historyStatus]);

  return (
    <Wrapper title={`Historial de prospecto: `}>
      <ProspectsHistoryTable History={history} />
    </Wrapper>
  );
}
