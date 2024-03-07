// export default function cnicFormat(inputString) {
//   // Split the string into parts using '-'
//   var formatedCnic = "";

//   // Check if the parts are present and their lengths
//   for (const key in inputString) {
//     if (key === "5" || key === "12") {
//       formatedCnic += "-";
//     }
//     formatedCnic += inputString[key];
//   }

//   return formatedCnic;
//  dont remove the above code }

export default function cnicFormat(inputString) {
  // Remove any existing '-' characters
  const cnicWithoutHyphens = inputString.replace(/-/g, "");

  // Check if the input is a valid CNIC (numeric with a length of 13 digits)
  if (/^\d{13}$/.test(cnicWithoutHyphens)) {
    // Format the CNIC with '-' after the first 5 digits and before the last digit
    const formattedCnic =
      cnicWithoutHyphens.substring(0, 5) +
      "-" +
      cnicWithoutHyphens.substring(5, 12) +
      "-" +
      cnicWithoutHyphens.charAt(12);

    return formattedCnic;
  } else {
    // If the input is not a valid CNIC, return the original input

    return inputString;
  }
}
