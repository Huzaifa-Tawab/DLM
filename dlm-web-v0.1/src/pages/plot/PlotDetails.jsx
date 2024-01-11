import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { useState } from "react";

function PlotDetails() {
  const location = useLocation();
  const [PlotDetail, setPlotDetail] = useState({});
  const id = location.state.plotRef;
  useEffect(() => {
    getPlotData();
  }, []);
  async function getPlotData() {
    const docRef = doc(db, "Plots", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPlotDetail(docSnap.data());
    }
  }
  return (
    <div>
      <img src={location.state.img} alt="" />
      <h1>{location.state.name}</h1>
      <h1>Payed {PlotDetail.PayedAmount}PKR</h1>
      <h1>Size {PlotDetail.PlotSize}</h1>
      <h1>File {PlotDetail.FileNumber}</h1>
      <h1>Total {PlotDetail.TotalAmount}PKR</h1>
    </div>
  );
}

export default PlotDetails;
