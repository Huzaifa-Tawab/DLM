import React, { useState, useEffect } from "react";
import Loader from "../components/loader/Loader";
import SideBar from "../components/Sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Ballotinguserdetails() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);
  const [ballotingData, setBallotingData] = useState([]);

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  async function fetchDataFromFirestore() {
    try {
      const ballotingCollectionRef = collection(db, "Balloting");
      const querySnapshot = await getDocs(ballotingCollectionRef);

      const ballotingDocuments = [];
      querySnapshot.forEach((doc) => {
        const { title, startDate, endDate } = doc.data();

        // Convert Firestore Timestamps to JavaScript Date objects
        const formattedStartDate = startDate ? startDate.toDate() : null;
        const formattedEndDate = endDate ? endDate.toDate() : null;

        ballotingDocuments.push({
          title,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      });

      setBallotingData(ballotingDocuments);
      setisLoading(false);
    } catch (error) {
      console.error("Error fetching Balloting data:", error);
      setisLoading(false);
    }
  }
  return (
    <>
      <SideBar
        element={
          isLoading ? (
            <Loader />
          ) : (
            <div className="empdatafinance-main" style={{ height: "100vh" }}>
              <div className="empl-hero-head">
                <h3>Balloting Details</h3>
              </div>
              <div
                className="empdata-column-1"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50vh",
                }}
              >
                {ballotingData.map((balloting) => (
                  <div key={balloting.id} className="empdata-coldata-1">
                    <div className="coldata-1-data">
                      <div className="col-data-1">
                        <h5>Customer Name:</h5>
                        <h5>Title:</h5>
                        <h5>Start Date:</h5>
                        <h5>End Date:</h5>
                        <h5>Status:</h5>
                        <h5>Agent:</h5>
                      </div>
                      <div className="col-data-2">
                        <span>{balloting.customerName}</span>
                        <span>{balloting.title}</span>
                        <span>
                          {balloting.startDate
                            ? balloting.startDate.toLocaleDateString()
                            : "N/A"}
                        </span>
                        <span>
                          {balloting.endDate
                            ? balloting.endDate.toLocaleDateString()
                            : "N/A"}
                        </span>
                        <span>{balloting.status}</span>
                        <span>{balloting.agent}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      />
    </>
  );
}

export default Ballotinguserdetails;
