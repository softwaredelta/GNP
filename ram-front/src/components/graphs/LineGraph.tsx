// (c) Delta Software 2023, rights reserved.

import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";

export interface ILineGraphProps {
  data: number[][];
  dataPie: number[];
  start: Date;
  end: Date;
}

export default function LineGraph({
  data,
  start,
  end,
  dataPie,
}: ILineGraphProps): JSX.Element {
  function getMonthString(first: Date, last: Date): string[] {
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
    const currentMonth: Date = new Date(first);

    while (currentMonth <= last) {
      const monthIndex: number = currentMonth.getMonth();
      months.push(monthNames[monthIndex]);

      currentMonth.setMonth(currentMonth.getMonth() + 1);
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
      categories: getMonthString(start, end),
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
        color: "#086fb4",
      },
      {
        name: "VIDA",
        type: "column",
        data: data[1],
        color: "#92D14F",
      },
      {
        name: "PYMES",
        type: "column",
        data: data[2],
        color: "#0C243E",
      },
      {
        name: "PATRIMONIAL",
        type: "column",
        data: data[3],
        color: "#E36C06",
      },
      {
        name: "AUTOS",
        type: "column",
        data: data[4],
        color: "#ff66cc",
      },
      {
        type: "pie",
        name: "Total",
        data: [
          {
            name: "SGMM",
            y: dataPie[0],
            color: "#086fb4",
            dataLabels: {
              enabled: true,
              distance: -50,
              format: "${point.total}",
              style: {
                fontSize: "15px",
                color: "black",
              },
            },
          },
          {
            name: "VIDA",
            y: dataPie[1],
            color: "#92D14F",
          },
          {
            name: "PYMES",
            y: dataPie[2],
            color: "#0C243E",
          },
          {
            name: "PATRIMONIAL",
            y: dataPie[3],
            color: "#E36C06",
          },
          {
            name: "AUTOS",
            y: dataPie[4],
            color: "#ff66cc",
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
