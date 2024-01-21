import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { useState } from "react";
import './plotdetails.css'
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";

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
    <>
    <Header/>
    <div className="Plot">
      <div className="owner">
      <img src={location.state.img} alt="Avatar" className="avatar"/>
      <h1>{location.state.name}</h1>
      </div>
      <div className="plot-details">
     <div className="details"><span>Total</span><h1> {PlotDetail.TotalAmount}PKR</h1></div> 
        <div className="details"><span>Piad</span> <h1>{PlotDetail.paidAmount}PKR</h1></div>
    <div className="details"><span>Plot Size</span>  <h1>{PlotDetail.PlotSize}</h1></div>
     <div className="details"><span>File No</span> <h1> {PlotDetail.FileNumber}</h1></div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default PlotDetails;
