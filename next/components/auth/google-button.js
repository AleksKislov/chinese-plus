import { useEffect, useState } from "react";
import { checkBaseUrl } from "../../actions/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const GoogleButton = () => {
  useEffect(() => {
    setBaseUrl(checkBaseUrl(window.location.href));
  });

  const [baseUrl, setBaseUrl] = useState(checkBaseUrl(""));

  return (
    <a className='btn btn-success btn-block' href={`${baseUrl}/api/auth/google`}>
      <div>
        Via Google <FontAwesomeIcon icon={faGoogle} />
      </div>
    </a>
  );
};

export default GoogleButton;
