import React from "react";
import myPdfFile from "../Assets/RequestBookingForm.pdf";

const PdfButton = () => {
  const handleDownload = () => {
    window.open(myPdfFile);
  };

  return (
    <div>
      <h1>PDF Button</h1>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
};

export default PdfButton;
