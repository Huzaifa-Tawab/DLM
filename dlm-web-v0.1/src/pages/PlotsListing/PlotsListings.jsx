import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import AddPlotListing from "../../components/Modals/AddPlotListing";
import SideBar from "../../components/Sidebar/sidebar";
import { onAuthStateChanged } from "firebase/auth";
import fwd from './fwd.png'
function PlotsListings() {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(true);
  const [listings, setListings] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [User, setUser] = useState({});

  useEffect(() => {
    getUser()
  }, []);
  const getUser = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "Agent", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          console.log(User);
    getPlotListings();
          
        }
      } else {
        // User is signed out
        // ...
      }
    });
  };
  async function getPlotListings() {
    const q = query(collection(db, "PlotListings"), where("isSold", "==", false));
    const querySnapshot = await getDocs(q);

    let temp = [];
    querySnapshot.forEach((doc) => {
      let single = doc.data();
      single["id"] = doc.id;
      temp.push(single);
    });

    const sortedMaps = Object.values(temp).sort((a, b) => b.createdAt - a.createdAt);
    setListings(sortedMaps);
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
                  <div className="plot-cards" style={{}}>
                    {listings.map((plot) => (
                      <div className="card"  style={{  display:"flex",justifyContent:"space-between"}} key={plot.id}>
                       <div>
                       <h4>{plot.PlotNumber}</h4>
                        <span className="first" style={{ color: "#fff" }}>
                        <strong>Price:</strong> {plot.price} PKR
                        </span>
                       </div>
                        <button
                        style={{background:"none"}}
                            onClick={() => {
                              // navigate(`/details/plot/${plot.id}`);
                            }}
                          >
                      <img src={fwd} alt="" width={"50px"} style={{borderRadius:"999px"}} />
                          </button>
                       
                      </div>
                    ))}
                  </div>
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
    </>
  );
}

export default PlotsListings;
