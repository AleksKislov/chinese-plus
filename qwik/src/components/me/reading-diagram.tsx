// @ts-ignore
import { GoogleCharts } from "google-charts";
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { dateToStr } from "~/misc/helpers/tools";

export type ReadStatType = {
  // user_id: string;
  have_read: number;
  daily_goal: number;
  createdAt: ISODate;
};

type ReadingDiagramType = {
  data: ReadStatType[];
  readDailyGoal: number;
  readTodayNum: number;
};

export const ReadingDiagram = component$(
  ({ data, readDailyGoal, readTodayNum }: ReadingDiagramType) => {
    const maxX = useSignal(1000);
    const MONTH_DAYS = 31;
    const CHART_COLUMNS: [string, string, string] = ["Дата", "Прочитано, 字", "Цель, 字"];
    // if (+localStorage.isDarkTheme) {
    //   const textColor = { color: "#fff" };
    //   options.hAxis.titleTextStyle = textColor;
    //   options.vAxis.titleTextStyle = textColor;
    //   options.vAxis.textStyle = textColor;
    //   options.backgroundColor = "#222";
    //   options.legend = { textStyle: textColor };
    // }

    useVisibleTask$(({ track }) => {
      track(() => readDailyGoal);
      track(() => readTodayNum);

      const maxGoal = Math.max(...data.map((day) => day.daily_goal));
      const maxResult = Math.max(...data.map((day) => day.have_read));
      if (maxGoal > maxResult) maxX.value = maxGoal * 2;
      if (maxGoal < maxResult) maxX.value = maxResult * 2;

      const today = new Date();
      const chartRows: [[string, number | string, number | string]] = [["", 0, 0]];
      chartRows[0] = [today.toISOString().slice(0, 10), readTodayNum, readDailyGoal];

      for (let i = 1; i < MONTH_DAYS; i++) {
        today.setDate(today.getDate() - 1);
        chartRows[i] = [today.toISOString().slice(0, 10), 0, 0];

        for (let j = 0; j < data.length; j++) {
          if (chartRows[i][0] === data[j].createdAt.slice(0, 10)) {
            chartRows[i][1] = data[j].have_read;
            chartRows[i][2] = data[j].daily_goal;
          }
        }
      }

      let previousGoal = 0;
      for (let i = 0; i < chartRows.length; i++) {
        if (chartRows[i][2] !== 0) {
          previousGoal = chartRows[i][2] as number;
        } else {
          chartRows[i][2] = previousGoal;
        }
        chartRows[i][0] = dateToStr(chartRows[i][0], true);
      }

      chartRows.push(CHART_COLUMNS);

      const TEXT_COLOR = { color: "rgb(180, 198, 239)" };
      const chartOptions = {
        hAxis: {
          title: "Дата",
          textStyle: TEXT_COLOR,
          titleTextStyle: TEXT_COLOR,
        },
        vAxis: {
          title: "Прочитано, 字",
          textStyle: TEXT_COLOR,
          titleTextStyle: TEXT_COLOR,
          viewWindow: { min: 1, max: { maxX: maxX.value } },
        },
        legend: {
          position: "bottom",
          alignment: "start",
          textStyle: TEXT_COLOR,
        },
        backgroundColor: { fill: "transparent" },
        seriesType: "area",
        series: {
          0: { pointShape: "circle", pointSize: 8 },
          1: { type: "line" },
        },
      };

      function drawChart() {
        const readChart = new GoogleCharts.api.visualization.AreaChart(
          document.getElementById("readingChart")
        );
        const chartData = GoogleCharts.api.visualization.arrayToDataTable(chartRows.reverse());
        readChart.draw(chartData, chartOptions);
      }

      GoogleCharts.load(drawChart);
    });

    return (
      <div class='mb-3 w-full h-80'>
        <div class='prose'>
          <h3>Статистика по чтению за месяц</h3>
        </div>

        <div id='readingChart' class='stats h-80 w-full'></div>
      </div>
    );
  }
);
