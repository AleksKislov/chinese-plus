import React from "react";
import { checkBaseUrl } from "../../actions/helpers";

const GoogleButton = () => {
  const baseURL = checkBaseUrl(window.location.href);
  return (
    <a
      className='btn btn-success btn-block'
      href={`${baseURL}/api/auth/google`}
      style={{ marginBottom: "0.5rem" }}
    >
      Via Google <i className='fab fa-google'></i>
    </a>
  );
};

export default GoogleButton;
