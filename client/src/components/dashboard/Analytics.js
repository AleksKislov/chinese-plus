import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Chart } from "react-google-charts";
import axios from "axios";
import { dateToStr } from "../../actions/helpers";

const Analytics = ({ user }) => {
  const [state, setstate] = useState(null);
  const [maxX, setMaxX] = useState(1000);
  const fetchData = async () => {
    const { data } = await axios.get("/api/users/reading_results");
    // console.log(data);

    if (data) {
      // setMaxX
      const maxGoal = Math.max(...data.map(day => day.daily_goal));
      const maxResult = Math.max(...data.map(day => day.have_read));
      if (maxGoal > maxResult) setMaxX(maxGoal * 2);
      if (maxGoal < maxResult) setMaxX(maxResult * 2);

      let today = new Date();
      let rows1 = [];
      rows1[0] = [today.toISOString().slice(0, 10)];
      rows1[0].push(user.read_today_num);
      rows1[0].push(user.daily_reading_goal);

      for (let i = 1; i < 30; i++) {
        today.setDate(today.getDate() - 1);
        // console.log(today.toISOString().slice(0, 10));
        rows1[i] = [today.toISOString().slice(0, 10)];
        rows1[i].push(0);
        rows1[i].push(0);
      }

      for (let i = 0; i < rows1.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (rows1[i][0] === data[j].createdAt) {
            rows1[i][1] = data[j].have_read;
            rows1[i][2] = data[j].daily_goal;
          }
        }
      }

      let previousGoal = 0;
      for (let i = 0; i < rows1.length; i++) {
        if (rows1[i][2] !== 0) {
          previousGoal = rows1[i][2];
        } else {
          rows1[i][2] = previousGoal;
        }
        rows1[i][0] = dateToStr(rows1[i][0], true);
      }

      // console.log(rows1);
      setstate(rows1.reverse());
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const options = {
    title: "Статистика по чтению за последний месяц",
    hAxis: { title: "Дата", textPosition: "none" },
    vAxis: { title: "Прочитано, 字", viewWindow: { min: 1, max: { maxX } } },
    // legend: "none",
    seriesType: "area",
    series: {
      0: { pointShape: "circle", pointSize: 8 },
      1: { type: "line" }
    }
  };

  return (
    state &&
    maxX && (
      <div className=''>
        <Chart
          columns={[
            {
              type: "string",
              label: "Дата"
            },
            {
              type: "number",
              label: "Прочитано, 字"
            },
            {
              type: "number",
              label: "Цель, 字"
            }
          ]}
          chartType='ComboChart'
          rows={state}
          options={options}
          width='100%'
          height='400px'
          legendToggle
        />
      </div>
    )
  );
};

const mapStateTioProps = state => ({
  comments: state.comments.lastComments,
  loading: state.posts.loading,
  user: state.auth.user
});

export default connect(mapStateTioProps, {})(Analytics);
