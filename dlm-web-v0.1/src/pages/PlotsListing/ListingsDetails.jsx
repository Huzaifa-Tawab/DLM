import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import avatar from "../../Assets/avatar.png";
import isAdmin from "../../../IsAdmin";
import SideBar from "../../components/Sidebar/sidebar";
function ListingsDetails() {
  const prams = useParams();
  const id = prams.id;
  const [PlotDetails, setPlotDetails] = useState({});
  const [offers, setOffers] = useState([]);
  const [isLoading, setisLoading] = useState(true);


  useEffect(() => {
    getPlotDetails();
  getPlotOffers()
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
  async function getPlotOffers() {
    const q = query(collection(db, "ListingOffers"), where("Plot", "==", id),where("status","==","pending"));
    const querySnapshot = await getDocs(q);
    let temp = [];
    querySnapshot.forEach((doc) => {
      temp.push({...doc.data(),id: doc.id});
    });
    setOffers(temp);
  }
  async function handleAction(action,id){
    console.log(id);
    const docRef = doc(db, 'ListingOffers', id);
      await updateDoc(docRef, { status: action });
      
  if (action=="accept") {
    rejectAllOffersExceptOne(id)
  }
}

  const rejectAllOffersExceptOne = async ( exceptionId) => {
    try {
     
      const batch = writeBatch(db);
      
          offers.forEach((offer) => {
        if (offer.id !== exceptionId) {
     
          const docRef = doc(db, 'ListingOffers', offer.id);
          
          // Update the status of the document to 'rejected'
          batch.update(docRef, { status: 'rejected' });
        }
      });
      
      // Commit the batch
      await batch.commit();
      console.log('All specified offers except one have been rejected successfully.');
    } catch (error) {
      console.error('Error updating documents: ', error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <SideBar
        element={
          <div>
            <div className="head-plot">
              <div className="avatr-image">
                <img src={avatar} alt="" />
              </div>
              <div className="Plot-box">
                <h1>Plot Details</h1>
                <div className="sec-heading">
                  <span className="first-text">Address:</span>
                  <span className="secon-text">{PlotDetails.Address}</span>
                </div>

                <div className="data-client">
                  <div className="row">
                    <span>Plot Size:</span>
                    <span>Agent ID:</span>
                    {isAdmin() && <span>Customer ID:</span>}
                    <span>City/Town</span>
                  </div>
                  <div className="row">
                    <span className="secon-row">{PlotDetails.PlotSize}</span>
                    <span className="secon-row">{PlotDetails.AgentId}</span>
                    {isAdmin() && (
                      <span className="secon-row">
                        {PlotDetails.CustomerId}
                      </span>
                    )}
                    <span className="secon-row">{PlotDetails.CityTown}</span>
                  </div>
                  <div className="row">
                    <span>File Number:</span>
                    <span>Category:</span>
                    <span>Paid Amount:</span>
                    <span>Total Amount:</span>
                    <span>Kin Name:</span>
                    <span>Kin Relation:</span>
                  </div>
                  <div className="row">
                    <span className="secon-row">{PlotDetails.FileNumber}</span>
                    <span className="secon-row">{PlotDetails.Category}</span>
                    <span className="secon-row">
                      {PlotDetails.paidAmount ? PlotDetails.paidAmount : 0}
                    </span>
                    <span className="secon-row">{PlotDetails.TotalAmount}</span>
                    <span className="secon-row">{PlotDetails.kinOverriden ?  PlotDetails.extendedKin.name:"Default" }</span>
                    <span className="secon-row">{PlotDetails.kinOverriden ?  PlotDetails.extendedKin.relation:"Default" }</span>
                  </div>
                </div>

              </div>
            </div>
            <div className="bottom-part-listing plots">
              
              {offers.map((e,i)=>  
              <div className="offerCard" key={i}>
                <div className="offer-titles">
                <h3>Offer {i+1}</h3>
                <h5>Price <strong>{e.Price}</strong> PKR</h5>
                </div>
                <div className="offerCardButton">
                 <button onClick={()=>{handleAction("accept",e.id)}}>Accept</button>
                 <button onClick={()=>{handleAction("reject",e.id)}}>Reject</button>
               </div>
              </div>
               )}
               
            </div>
        
          </div>
        }
      />

   
    </>
  );
}

export default ListingsDetails;
