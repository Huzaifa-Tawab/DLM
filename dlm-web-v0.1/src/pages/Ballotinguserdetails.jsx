import React, { useState, useEffect } from "react";
import Loader from "../components/loader/Loader";
import SideBar from "../components/Sidebar/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ref } from "firebase/storage";

function BallotingSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);
  const [ballotingData, setBallotingData] = useState([]);

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  async function fetchDataFromFirestore() {
    try {
      const ballotingCollectionRef = doc(db, "Balloting", id);
      const querySnapshot = await getDoc(ballotingCollectionRef);

      if (querySnapshot.exists) {
        setBallotingData(querySnapshot.data());
      }
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
                <div className="empdata-coldata-1">
                  <div className="coldata-1-data">
                    <div className="col-data-1">
                      <h5>Title:</h5>
                      <h5>Start Date:</h5>
                      <h5>End Date:</h5>
                      <h5>Status:</h5>
                      <h5>Winner:</h5>
                    </div>
                    <div className="col-data-2">
                      <span>{ballotingData.title}</span>
                      <span>
                        {ballotingData.startDate
                            ? Date(ballotingData.startDate * 1000)
                            : "N/A"}
                      </span>
                      <span>
                        {ballotingData.endDate
                            ? Date(ballotingData.endDate * 1000)
                            : "N/A"}
                      </span>
                      <span>{ballotingData.winnerDeclared ?"Completed":"Pending"}</span>
                      <span>{ballotingData.winner ? ballotingData.winner:"Not Declared"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <table className="fl-table">
                  <thead>
                    <tr>
                      <th>Agent Name</th>
                      <th>Agent ID</th>
                      <th>Submitted At</th>
                      <th>Submitted File</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ballotingData.submission.map((submission) => (
                      <tr>
                        <td>{submission.agentName}</td>
                        <td>{submission.agentId}</td>
                        <td>{Date(submission.timestamp.seconds * 1000)}</td>

                        <td>{submission.plot}</td>
                        <td>
                          {ballotingData.winnerDeclared ? (
                            "Winner Decleared"
                         
                          ) : (
                            <button className="button-new-view">
                            Make It Winner
                          </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        }
      />
    </>
  );
}

export default BallotingSingle;
