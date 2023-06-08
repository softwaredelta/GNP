// (c) Delta Software 2023, rights reserved.

import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsFunnel from "highcharts/modules/funnel";

import { useRef } from "react";
import { IProspectStatus } from "../../types";

highchartsFunnel(Highcharts);

interface ProspectChartProps {
  prospectInfo: IProspectStatus;
}

export default function ProspectsChart({
  prospectInfo,
}: ProspectChartProps): JSX.Element {
  const options: Highcharts.Options = {
    chart: {
      type: "funnel",

      backgroundColor: "transparent",
    },
    title: {
      text: "Embudo de prospectos",
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b> ({point.y:,.0f})",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          softConnector: true,
        },
        center: ["40%", "50%"],
        neckWidth: "30%",
        neckHeight: "25%",
        width: "60%",
        height: "70%",
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "Prospecto registrado",
        type: "funnel",
        data: [
          ["Nuevo prospecto", prospectInfo?.["Nuevo prospecto"] ?? 0],
          ["Cita agendada", prospectInfo?.["Cita agendada"] ?? 0],
          ["Cita efectiva", prospectInfo?.["Cita efectiva"] ?? 0],
          ["Solicitud de seguro", prospectInfo?.["Solicitud de seguro"] ?? 0],
          ["Poliza pagada", prospectInfo?.["Poliza pagada"] ?? 0],
        ],
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            plotOptions: {
              series: {
                dataLabels: {
                  inside: true,
                },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                center: ["50%", "50%"],
                width: "100%",
              },
            },
          },
        },
      ],
    },
  };

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <div className="pt-5">
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartComponentRef}
        {...HighchartsReact.props}
        options={options}
      />
    </div>
  );
}
