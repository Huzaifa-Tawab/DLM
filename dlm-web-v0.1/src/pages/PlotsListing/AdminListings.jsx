import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import Loader from "../../components/loader/Loader";
import SideBar from "../../components/Sidebar/sidebar";
import PlotsOffer from "./PlotsOffer";
import "./plotListings.css";

function AdminPlotsListings() {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(true);
  const [listings, setListings] = useState([]);
  const [Otherlistings, setOtherListings] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.uid === "pjB7Lyyy6xMIim99mvbyUqjE1Op2") {
          getPlotListings();
        } else {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  async function getPlotListings() {
    const q = query(collection(db, "PlotListings"));
    const querySnapshot = await getDocs(q);

    let temp = [];
    let temp2 = [];
    querySnapshot.forEach((doc) => {
      let single = doc.data();
      single["id"] = doc.id;
      if (doc.data().offerAccepted ) {
        temp.push(single);
      }
      temp2.push(single);
    });

    setListings(temp);
    setOtherListings(temp2);
    setisloading(false);
  }
  async function handleSold(lid){
  await updateDoc(doc(db, 'PlotListings', lid), { isSold: true, });
getPlotListings()
}
  return isloading ? (
    <Loader />
  ) : (
    <SideBar
      element={
        <>
          <div className="Admin-Home">
            <div className="hero--head">
              <h1>Listings</h1>
            </div>
          </div>
          <div className="AdminPlotsListings">
            <div>
              <div className="plots" style={{height:"40vh",overflow:"scroll"}}>
                <h1>Accepted Offers</h1>
                <div className="plot-cards">
                  {listings.map((plot) => (
                    <div
                      className="card"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        backgroundColor: "#f9f9f9",
          
                       
                      }}
                      key={plot.id}
                    >
                      <div style={{ color:"#000",}}>
                        <h4 style={{ margin: "5px 0",color:"#000" }}>{plot.PlotNumber}</h4>
                        <h4 style={{ margin: "5px 0",color:"#000" }}>
                          {plot.offerData.uid} Offered {plot.offerData.Price}PKR
                        </h4>
                        <h4 style={{ margin: "5px 0", color: "green" }}>Accepted</h4>
                        <h4 style={{ margin: "5px 0", color: "blue" }}>
                          Sold: {plot.isSold? "Yes" : "No"}
                        </h4>
                      {!plot.isSold &&  <button onClick={()=>{handleSold(plot.id)}} style={{background:"black",color:"white"}}>Mark As Sold</button>}
                       
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <br />
              <div className="plots" style={{height:"40vh",overflow:"scroll"}}>
                <h1>All Listings</h1>
                <div className="">
                  {Otherlistings.map((plot) => {
                    const date = new Date(plot.createdAt.seconds * 1000);
                    return (
                      <div
                        key={plot.id}
                        style={{
                          borderBottom: "1px solid #ddd",
                          padding: "10px 0",
                          marginBottom: "10px",
                        }}
                      >
                        <h3 style={{ margin: "5px 0" }}>
                          {plot.AgentId} Listed {plot.PlotNumber} for trading
                          with price {plot.price} PKR on {date.toDateString()}
                        </h3>
                        <PlotsOffer id={plot.PlotNumber} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      }
    />
  );
}

export default AdminPlotsListings;
