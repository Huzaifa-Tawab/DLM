import React, { useState, useEffect } from "react";
import Loader from "../components/loader/Loader";
import SideBar from "../components/Sidebar/sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db, rdb } from "../firebase";
import "./ballotingdetails.css";
import DeclareWinnersModal from "../components/Modals/DeclareWinnersModal";
import { set, ref, getDatabase, serverTimestamp } from "firebase/database";

function BallotingSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);
  const [ballotingData, setBallotingData] = useState([]);
  const [ShowModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const handleClick = async () => {
    ballotingData.winners.forEach(async (winner) => {
      const plotRef = doc(db, "Plots", winner);
      // getDoc(plotRef, ).then(result=>{
      //   console.log(result);
      // })
      await updateDoc(plotDoc.ref, { isNowPlot: true });
    });
    try {
      const db = getDatabase();
      await set(ref(db, "/winners/"), {
        id: id,
      }).then((e) => {
        setTimeout(() => {
          set(ref(db, "/winners/"), {
            id: null,
          });
        }, 5000);
      });
    } catch (error) {
      console.log(e);
    }
  };

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
            <div className="main">
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
                    // height: "50vh",
                  }}
                >
                  <div className="ballotingdata-coldata-1">
                    <div className="coldata-1-data">
                      <div className="ballot-col-data-1">
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
                        <span>
                          {ballotingData.winnerDeclared
                            ? "Completed"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                    {ballotingData.winnerDeclared ? (
                      <></>
                    ) : (
                      <button
                        onClick={() => {
                          setShowModal(true);
                        }}
                      >
                        {" "}
                        Set Winners
                      </button>
                    )}
                    {ballotingData.winnerDeclared ? (
                      <button onClick={handleClick}>Announce Result</button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div>
                  <div className="baloting-numbers">
                    {ballotingData.winnerDeclared
                      ? ballotingData.winners.map((e) => (
                          <p
                            style={{
                              margin: "10px",
                              padding: "10px",
                              background: "black",
                              color: "white",
                              border: "2px solid #A4243B",
                              borderRadius: "10px",
                            }}
                          >
                            {" "}
                            {e}
                          </p>
                        ))
                      : "Not Declared"}
                  </div>

                  <table className="fl-table">
                    <thead>
                      <tr>
                        <th>Agent Name</th>
                        <th>Agent ID</th>
                        {/* <th>Submitted At</th> */}
                        <th>Submitted Files</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ballotingData.submission.map((submission) => (
                        <tr>
                          <td>{submission.agentName}</td>
                          <td>{submission.agentId}</td>
                          {/* <td>{Date(submission.timestamp.seconds * 1000)}</td> */}
                          <td className="baloting-tble-files">
                            {submission.plots.split(",").map((e) => (
                              <span className="p-span" key={e}>
                                {e}
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        }
      />
      <DeclareWinnersModal
        show={ShowModal}
        onClose={() => {
          setShowModal(false);
        }}
        ballotingId={id}
      />
    </>
  );
}

export default BallotingSingle;
