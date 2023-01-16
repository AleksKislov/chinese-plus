import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowRestore } from "@fortawesome/free-solid-svg-icons";

export default function MoreInfoBtn({ handleShow }: { handleShow: () => void }) {
  return (
    <OverlayTrigger placement='bottom' overlay={<Tooltip>Примеры и другие значения</Tooltip>}>
      <Button variant='info' size='sm' onClick={handleShow}>
        <FontAwesomeIcon icon={faWindowRestore} />
      </Button>
    </OverlayTrigger>
  );
}
