// (c) Delta Software 2023, rights reserved.

import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useRef } from "react";

export interface ILineGraphProps {
  dataKey: string[];
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
  dataKey,
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
        name: dataKey[0],
        type: "column",
        data: data[0],
        color: "#086fb4",
      },
      {
        name: dataKey[1],
        type: "column",
        data: data[1],
        color: "#92D14F",
      },
      {
        name: dataKey[2],
        type: "column",
        data: data[2],
        color: "#0C243E",
      },
      {
        name: dataKey[3],
        type: "column",
        data: data[3],
        color: "#E36C06",
      },
      {
        name: dataKey[4],
        type: "column",
        data: data[4],
        color: "#ff66cc",
      },
      {
        type: "pie",
        name: "Total",
        data: [
          {
            name: dataKey[0],
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
            name: dataKey[1],
            y: dataPie[1],
            color: "#92D14F",
          },
          {
            name: dataKey[2],
            y: dataPie[2],
            color: "#0C243E",
          },
          {
            name: dataKey[3],
            y: dataPie[3],
            color: "#E36C06",
          },
          {
            name: dataKey[4],
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
