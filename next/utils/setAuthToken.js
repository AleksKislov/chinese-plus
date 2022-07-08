import axios from "axios";

export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export const setGoogleAuth = id => {
  if (id) {
    axios.defaults.headers.common["x-google-userid"] = id;
  } else {
    delete axios.defaults.headers.common["x-google-userid"];
  }
};
