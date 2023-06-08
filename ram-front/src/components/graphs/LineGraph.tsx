// (c) Delta Software 2023, rights reserved.

import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";

export interface ILineGraphProps {
  data: number[][];
  dataPie: number[];
  firstMonth: number;
  lastMonth: number;
}

export default function LineGraph({
  data,
  firstMonth,
  lastMonth,
  dataPie,
}: ILineGraphProps): JSX.Element {
  function getMonthString(first: number, last: number): string[] {
    const monthNames: string[] = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const months: string[] = [];
    for (let i = first; i <= last; i++) {
      const monthIndex: number = i % 12;
      months.push(monthNames[monthIndex]);
    }

    return months;
  }

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "Acumulado por ramos de seguro",
    },
    xAxis: {
      categories: getMonthString(firstMonth, lastMonth),
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Acumulado de Primas Pagadas (MXN)",
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "SGMM",
        type: "column",
        data: data[0],
      },
      {
        name: "VIDA",
        type: "column",
        data: data[1],
      },
      {
        name: "PYMES",
        type: "column",
        data: data[2],
      },
      {
        name: "PATRIMONIAL",
        type: "column",
        data: data[3],
      },
      {
        name: "AUTOS",
        type: "column",
        data: data[4],
      },
      {
        type: "pie",
        name: "Total",
        data: [
          {
            name: "SGMM",
            y: dataPie[0],
            dataLabels: {
              enabled: true,
              distance: -50,
              format: "${point.total}",
              style: {
                fontSize: "15px",
              },
            },
          },
          {
            name: "VIDA",
            y: dataPie[1],
          },
          {
            name: "PYMES",
            y: dataPie[2],
          },
          {
            name: "PATRIMONIAL",
            y: dataPie[3],
          },
          {
            name: "AUTOS",
            y: dataPie[4],
          },
        ],
        center: [400, 20],
        size: 100,
        innerSize: "70%",
        showInLegend: false,
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
        {...HighchartsReact.props}
      />
    </div>
  );
}
