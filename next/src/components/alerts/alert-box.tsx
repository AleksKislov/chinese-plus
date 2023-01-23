"use client";
import ToastContainer from "react-bootstrap/ToastContainer";
import ToastAutoHide from "./alert-autohide";
import { useAlertCtx } from "../../context/alerts/store";

export default function AlertBox() {
  const { alerts, setAlerts } = useAlertCtx();

  const remove = (id: string) => {
    setAlerts(alerts.filter((x) => id !== x.id));
  };

  return (
    <ToastContainer
      position='top-end'
      className='pt-5 position-fixed pe-4'
      style={{ width: "16rem" }}
    >
      {alerts &&
        alerts.map((x) => (
          <ToastAutoHide bgColor={x.bgColor} key={x.id} remove={remove} id={x.id} txt={x.txt} />
        ))}
    </ToastContainer>
  );
}
