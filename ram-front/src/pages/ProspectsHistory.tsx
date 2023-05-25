// (c) Delta Software 2023, rights reserved.

import Wrapper from "../containers/Wrapper";
import { useEffect, useState } from "react";
import ProspectListHistory from "../components/prospects/ProspectListHistory";

const INITIAL_STATE = [
  {
    estado: "Cliente",
    comentario:
      "Se ha realizado las llamadas y agendó su cita para realizar el aseguramiento de su patrominio",
    fecha: "99/99/99",
  },
  {
    estado: "Llamada",
    comentario:
      "¡Enhorabuena por tu venta! Lograr una venta siempre es emocionante y un logro para celebrar.",
    fecha: "99/99/99",
  },
  {
    estado: "Cancelado",
    comentario:
      "Recuerda que cada venta es una oportunidad para construir relaciones duraderas con tus clientes.",
    fecha: "99/99/99",
  },
  {
    estado: "Cliente",
    comentario:
      "La perseverancia es clave si encuentras obstáculos en el camino. Aprende de ellos y sigue adelante.",
    fecha: "99/99/99",
  },
];

interface Hist {
  estado: string;
  comentario: string;
  fecha: string;
}

export default function ProspectsHistory() {
  const [history, setHistory] = useState<Array<Hist>>([]);
  useEffect(() => {
    setHistory(INITIAL_STATE);
  }, []);

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
                      Fecha de actualizacion de estado
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
                    key={h.estado}
                    estado={h.estado}
                    comentario={h.comentario}
                    fecha={h.fecha}
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
