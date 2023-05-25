// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { useEffect, useState } from "react";
import ProspectsHistoryTable from "../components/prospects/ProspectHistoryTable";

const INITIAL_STATE = [
  {
    id: "1",
    date: new Date(),
    statusName: "Cliente",
    comments:
      "Mantén una actitud positiva y entusiasta durante todo el proceso de venta. La energía positiva es contagiosa y puede marcar la diferencia.",
  },
];

interface History {
  id: string;
  statusName: string;
  comments: string;
  date: Date;
}

export default function ProspectsHistory() {
  const [history, setHistory] = useState<Array<History>>([]);
  useEffect(() => {
    setHistory(INITIAL_STATE);
  }, []);
  if (history.length === 0) return <h1>No hay historial del prospecto</h1>;
  return (
    <Wrapper title="Historial de prospecto: ">
      <ProspectsHistoryTable History={history} />
    </Wrapper>
  );
}
