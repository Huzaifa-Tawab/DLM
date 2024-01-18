const isFinance = () => {
  // Get the current date
  let type = localStorage.getItem("Type");
  if (type && type.toLowerCase() == "finance") {
    return true;
  } else {
    return false;
  }
};

export default isFinance;
