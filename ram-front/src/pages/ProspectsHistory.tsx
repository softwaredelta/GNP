// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { useEffect, useState } from "react";
import ProspectListHistory from "../components/prospects/ProspectListHistory";

const INITIAL_STATE = [
  {
    state: "Cliente",
    comment:
      "Se ha realizado las llamadas y agendó su cita para realizar el aseguramiento de su patrominio",
    date: "99/99/99",
  },
  {
    state: "Llamada",
    comment:
      "¡Enhorabuena por tu venta! Lograr una venta siempre es emocionante y un logro para celebrar.",
    date: "99/99/99",
  },
  {
    state: "Cancelado",
    comment:
      "Recuerda que cada venta es una oportunidad para construir relaciones duraderas con tus clientes.",
    date: "99/99/99",
  },
  {
    state: "Cliente",
    comment:
      "La perseverancia es clave si encuentras obstáculos en el camino. Aprende de ellos y sigue adelante.",
    date: "99/99/99",
  },
];

interface History {
  state: string;
  comment: string;
  date: string;
}

export default function ProspectsHistory() {

  const [history, setHistory] = useState<Array<History>>([]);
  useEffect(() => {
    setHistory(INITIAL_STATE);
  }, []);
   
  if (history.length === 0) return <h1>No hay historial del prospecto</h1>;
  return (
    <Wrapper title="Historial de prospecto: ">
      <div className="flex flex-col items-center justify-center pt-8">
        <>
          <div className="flex items-center justify-end">
            <div className="m-6">
              <div className="flex">
                <div className="w-3/3 flex items-center pr-40">
                  <div className="rounded-md  bg-gnp-blue-500">
                    <p className="px-5 py-2 text-center font-semibold text-gray-500 text-white">
                      Estado
                    </p>
                  </div>
                </div>
                <div className="w-3/3 px-19 flex items-center">
                  <div className="rounded-md  bg-gnp-blue-500">
                    <p className="px-5 py-2 text-center font-semibold text-gray-500 text-white">
                      Comentario
                    </p>
                  </div>
                </div>
                <div className="w-3/3 flex items-center pl-36">
                  <div className="rounded-md  bg-gnp-blue-500">
                    <p className="px-5 py-2 text-center font-semibold text-gray-500 text-white">
                      Fecha de actualizacion de state
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex min-h-[26%] w-full justify-center gap-10">
            <div className="w-3/5">
              {history.map((h) => {
                return (
                  <ProspectListHistory
                    key={h.state}
                    state={h.state}
                    comment={h.comment}
                    date={h.date}
                  />
                );
              })}
            </div>
          </div>
        </>
      </div>
    </Wrapper>
  );
}
