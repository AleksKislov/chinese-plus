import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../layout/Spinner";
import Task from "./Task";
import { Link } from "react-router-dom";

const Plans = ({}) => {
  useEffect(() => {
    loadAll();
  }, []);

  const [data, setData] = useState(null);
  const [tasks0, setTasks0] = useState(null);
  const [tasks1, setTasks1] = useState(null);
  const [tasks2, setTasks2] = useState(null);
  const [tasks3, setTasks3] = useState(null);

  const loadAll = async () => {
    try {
      const { data } = await axios.get("/api/plans");
      // console.log(data);
      setData(data);
      setTasks0(data.filter(x => x.task_type === 0));
      setTasks1(data.filter(x => x.task_type === 1));
      setTasks2(data.filter(x => x.task_type === 2));
      setTasks3(data.filter(x => x.task_type === 3));
    } catch (err) {
      console.log(err);
    }
  };

  return data ? (
    <div className='row'>
      <div className='col-sm-12'>
        <h2>Канбан Проекта</h2>
        <p className='text-primary'>看板 kànbǎn - доска по текущим задачам и планам</p>
        <div className='alert alert-light'>
          На доске не хватает чего-то, что полезно реализовать? Просим рассказать об этом в{" "}
          <Link to='/posts'>Гостевой</Link>
        </div>
      </div>
      <div className='col-sm-3 kanbanCol'>
        <div className='greyKanban kanban'>
          <h5 className='text-center'>БЭКЛОГ</h5>
          {tasks0 && tasks0.map(task => <Task task={task} key={task._id} />)}
        </div>
      </div>
      <div className='col-sm-3 kanbanCol'>
        <div className='orangeKanban kanban'>
          <h5 className='text-center'>ВЫПОЛНИТЬ</h5>
          {tasks1 && tasks1.map(task => <Task task={task} key={task._id} />)}
        </div>
      </div>
      <div className='col-sm-3 kanbanCol'>
        <div className='blueKanban kanban'>
          <h5 className='text-center'>ВЫПОЛНЯЕТСЯ</h5>
          {tasks2 && tasks2.map(task => <Task task={task} key={task._id} />)}
        </div>
      </div>

      <div className='col-sm-3 kanbanCol'>
        <div className='greenKanban kanban'>
          <h5 className='text-center'>ВЫПОЛНЕНО</h5>
          {tasks3 && tasks3.map(task => <Task task={task} key={task._id} />)}
        </div>
      </div>
    </div>
  ) : (
    <Spinner />
  );
};

export default Plans;
