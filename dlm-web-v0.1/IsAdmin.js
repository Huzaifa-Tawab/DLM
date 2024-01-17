import React from "react";

const isAdmin = () => {
  // Get the current date
  let type = localStorage.getItem("Type");
  if (type && type.toLowerCase() == "admin") {
    return true;
  } else {
    return false;
  }
};

export default isAdmin;
