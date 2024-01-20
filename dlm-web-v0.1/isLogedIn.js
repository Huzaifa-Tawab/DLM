import React from "react";

const isLogedIn = () => {
  // Get the current date
  let auth = localStorage.getItem("Login");
  if (auth) {
    return true;
  } else {
    return false;
  }
};

export default isLogedIn;
