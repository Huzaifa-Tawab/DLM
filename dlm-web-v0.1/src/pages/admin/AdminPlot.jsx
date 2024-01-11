import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

function AdminPlot() {
  const prams = useParams();
  const id = prams.id;

  const [PlotDetails, setPlotDetails] = useState({});
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    getPlotDetails();
  }, []);
  async function getPlotDetails() {
    const docRef = doc(db, "Plots", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setPlotDetails(docSnap.data());
      console.log(docSnap.data());
      setisLoading(false);
    }
  }
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div>
        <h1>Plot Information</h1>
        <ul>
          <li>
            <strong>Plot Size:</strong> {PlotDetails.PlotSize}
          </li>
          <li>
            <strong>Agent ID:</strong> {PlotDetails.AgentId}
          </li>
          <li>
            <strong>Customer ID:</strong> {PlotDetails.CustomerId}
          </li>
          <li>
            <strong>City/Town:</strong> {PlotDetails.CityTown}
          </li>
          <li>
            <strong>Address:</strong> {PlotDetails.Address}
          </li>
          <li>
            <strong>File Number:</strong> {PlotDetails.FileNumber}
          </li>
          <li>
            <strong>Category:</strong> {PlotDetails.Category}
          </li>
          <li>
            <strong>Paid Amount:</strong> {PlotDetails.PaidAmount}
          </li>
          <li>
            <strong>Total Amount:</strong> {PlotDetails.TotalAmount}
          </li>
        </ul>
      </div>
    </>
  );
}

export default AdminPlot;
