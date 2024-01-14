// import React, { useRef } from "react";
// import html2pdf from "html2pdf.js";

// import originalHtmlContent from './path-to-your-html-file.html';

// const A4Document = () => {
//   const contentRef = useRef(null);

//   const handlePrint = () => {
//     const modifiedContent = updateHtmlContent(originalHtmlContent);
//     printPdf(modifiedContent);
//   };

//   const updateHtmlContent = (htmlString) => {

//     const dynamicData = "Dynamic Content";
//     return htmlString.replace(
//       "<!-- ReplaceThisWithDynamicContent -->",
//       dynamicData
//     );
//   };

//   const printPdf = (htmlContent) => {
//     const pdfOptions = {
//       margin: 10,
//       filename: "a4_document.pdf",
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };

//     html2pdf().from(htmlContent).set(pdfOptions).outputPdf();
//   };

//   return (
//     <div>
//       {/* This is the content you want to update */}
//       <div
//         ref={contentRef}
//         dangerouslySetInnerHTML={{ __html: originalHtmlContent }}
//       />

//       {/* Button to trigger printing */}
//       <button onClick={handlePrint}>Print PDF</button>
//     </div>
//   );
// };

// export default A4Document;
