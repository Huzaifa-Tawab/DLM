import React from "react";

const getDate = () => {
  // Get the current date
  const currentDate = new Date();

  // Format the current date as "MM-DD-YYYY"
  const formattedCurrentDate = `${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")}-${currentDate.getFullYear()}`;

  // Return the formatted current date string
  return formattedCurrentDate;
};

export default getDate;
