export default function cnicFormat(inputString) {
  // Split the string into parts using '-'
  var formatedCnic = "";

  // Check if the parts are present and their lengths
  for (const key in inputString) {
    if (key === "5" || key === "12") {
      formatedCnic += "-";
    }
    formatedCnic += inputString[key];
  }

  return formatedCnic;
}
