import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

import AddPlotListing from "../../components/Modals/AddPlotListing";
import SideBar from "../../components/Sidebar/sidebar";
import { onAuthStateChanged } from "firebase/auth";
import fwd from "./fwd.png";
import "./plotListings.css";
import AddOffer from "../../components/Modals/AddOffer";
function PlotsListings() {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(true);
  const [listings, setListings] = useState([]);
  const [Otherlistings, setOtherListings] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [oid, setOid] = useState("");
  const [listingId, setListingId ] = useState("");
  const [User, setUser] = useState({});
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "Agent", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          // console.log(User);
          getPlotListings();
          Myoffers(user.uid);
        }
      } else {
        // User is signed out
        // ...
      }
    });
  };
  async function getPlotListings() {
    console.log("test");
    const q = query(
      collection(db, "PlotListings"),
      where("isSold", "==", false)
    );
    const querySnapshot = await getDocs(q);

    let temp = [];
    let temp2 = [];
    querySnapshot.forEach((doc) => {
      let single = doc.data();
      single["id"] = doc.id;
      if (User.Cnic == doc.AgentId) {
        temp.push(single);
      } else {
        temp2.push(single);
      }
    });

    const sortedMaps = Object.values(temp).sort(
      (a, b) => b.createdAt - a.createdAt
    );
    setListings(sortedMaps);
    setOtherListings(temp2);
    setisloading(false);
  }

  async function Myoffers(id) {
    console.log("test");
    const q = query(collection(db, "ListingOffers"), where("uid", "==", id));
    const querySnapshot = await getDocs(q);
    let temp = [];

    querySnapshot.forEach((doc) => {
      let single = doc.data();
      single["id"] = doc.id;
      temp.push(single);
    });

    const sortedMaps = Object.values(temp).sort(
      (a, b) => b.createdAt - a.createdAt
    );
    setMyOffers(sortedMaps);
    setisloading(false);
  }

  const handleAddPlot = () => {
    getPlotListings();
  };

  return isloading ? (
    <Loader />
  ) : (
    <>
      <SideBar
        element={
          <>
            <div className="Admin-Home">
              <div className="hero--head">
                <h1>Listings</h1>
                <button onClick={() => setShowDocModal(true)}>Add New</button>
              </div>
            </div>
            <div className="PlotsListings">
              <div>
                <div className="plots">
                  <h1>My Listings</h1>
                  <div className="plot-cards" style={{}}>
                    {listings.map((plot) => (
                      <div
                        className="card"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        key={plot.id}
                      >
                        <div>
                          <h4>{plot.type}</h4>

                          <span className="first" style={{ color: "#fff" }}>
                            <strong>Price:</strong>{" "}
                            <span
                              style={{
                                color: "black",
                                fontSize: "18px",
                                fontWeight: "900",
                              }}
                            >
                              {plot.price} PKR
                            </span>
                          </span>
                          <h4>{plot.isSold ? "Sold Out" : "Available"}</h4>
                        </div>
                        <button
                          style={{ background: "none" }}
                          onClick={() => {
                            navigate(`/listings/${plot.PlotNumber}`);
                          }}
                        >
                          <img
                            src={fwd}
                            alt=""
                            width={"50px"}
                            style={{ borderRadius: "999px" }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <br />
                <div className="plots">
                  <h1> All Listings</h1>
                  <div className="plot-cards" style={{}}>
                    {listings.map((plot) => (
                      <div
                        className="card"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        key={plot.id}
                      >
                        <div>
                          <h4>{plot.type}</h4>

                          <span className="first" style={{ color: "#fff" }}>
                            <strong>Price:</strong>{" "}
                            <span
                              style={{
                                color: "black",
                                fontSize: "18px",
                                fontWeight: "900",
                              }}
                            >
                              {plot.price} PKR
                            </span>
                          </span>
                          <h4>{plot.isSold ? "Sold Out" : "Available"}</h4>
                        </div>
                        <button
                          style={{ background: "none" }}
                          onClick={() => {
                            // navigate(`/details/plot/${plot.id}`);
                            setShowModal(true);
                            setOid(plot.PlotNumber);
                            setListingId(plot.id)
                          }}
                        >
                          <img
                            src={fwd}
                            alt=""
                            width={"50px"}
                            style={{ borderRadius: "999px" }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="plots plots-listings-logs">
                <h4>Recent Activity</h4>
                <div className="logs-list">
                  {myOffers.map((e, y) => (
                    <div className="offer-card" key={y}>
                      <h5>{e.Price} PKR offer is <b className={`offer-${e.status}`}> {e.status}</b></h5>
                                
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        }
      />
      <AddPlotListing
        user={User}
        show={showDocModal}
        onClose={() => setShowDocModal(false)}
        onAddPlot={handleAddPlot}
      />
      <AddOffer
        uid={User.Cnic}
        oid={oid}
        listingId={listingId}
        showModal={showModal}
        onClose={() => setShowModal(false)}
        // onAddPlot={handleAddPlot}
      />
    </>
  );
}

export default PlotsListings;
