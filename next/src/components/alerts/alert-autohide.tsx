import { useState } from "react";
import Toast from "react-bootstrap/Toast";

export default function ToastAutoHide({
  bgColor,
  remove,
  id,
  txt,
}: {
  bgColor: string;
  remove: Function;
  id: string;
  txt: string;
}) {
  const [show, setShow] = useState(true);

  return (
    <Toast
      onClose={() => {
        remove(id);
        setShow(false);
      }}
      className={`bg-${bgColor}`}
      show={show}
      delay={4000}
      autohide
    >
      <Toast.Body>{txt}</Toast.Body>
    </Toast>
  );
}
