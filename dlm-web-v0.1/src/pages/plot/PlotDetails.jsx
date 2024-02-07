import { doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { useState } from "react";
import "./plotdetails.css";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/loader/Loader";
import logo from "../../Assets/SoftXion.png";

function PlotDetails() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [isBlocked, setisBlocked] = useState(false);
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
      setisBlocked(docSnap.data()).Blocked;
    }
  }
  return isLoading ? (
    <Loader />
  ) : true ? (
    <>
      <div className="Plot">
        <div className="owner">
          <img src={location.state.img} alt="Avatar" className="avatar" />
          <h1>{location.state.name}</h1>
        </div>
        <div className="plot-details">
          <div className="details">
            <span>Total</span>
            <h1> {PlotDetail.TotalAmount} PKR</h1>
          </div>
          <div className="details">
            <span>Piad</span> <h1>{PlotDetail.paidAmount} PKR</h1>
          </div>
          <div className="details">
            <span>Plot Size</span> <h1>{PlotDetail.PlotSize} Marla</h1>
          </div>
          <div className="details">
            <span>File No</span> <h1> {PlotDetail.FileNumber}</h1>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>You Are Blocked</>
  );
}

export default PlotDetails;
