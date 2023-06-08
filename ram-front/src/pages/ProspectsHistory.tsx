// (c) Delta Software 2023, rights reserved.

// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=998764442
// * M5_S07

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

  const { response: historyStatus, error: errorStatus } = useAxios<IStatus[]>({
    url: `status-prospect/${idProspect}`,
    method: "GET",
  });

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
