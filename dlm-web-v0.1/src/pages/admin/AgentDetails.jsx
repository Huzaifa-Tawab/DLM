import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./clientdetails.css";
import avatar from "../../Assets/avatar.png";
import edit from "../../Assets/edit.png";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import AddDocs from "../../components/Modals/AddDocs";
import { PiBuildingsBold } from "react-icons/pi";
import isAdmin from "../../../IsAdmin";
import SideBar from "../../components/Sidebar/sidebar";
import cnicFormat from "../../../cnicFormatter";
import AddDocsAgent from "../../components/Modals/AddDocsAgent";
function AgentDetails() {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(true);
  const [userData, setData] = useState();
  const [Plots, setPlots] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [UserDocs, setUseDocs] = useState({});
  const [SponcerName, setSponcerName] = useState("");
  const [UserStatus, setUserStatus] = useState();
  const prams = useParams();

  useEffect(() => {
    getdata();
  }, []);

  async function getdata() {
    const docRef = doc(db, "Agent", prams.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setData(docSnap.data());

      if (docSnap.data().Plots != null) {
        getPlotsData(docSnap.data().Plots);
        setUseDocs(docSnap.data().Document);
        getUserStatus(prams.id);
        if (docSnap.data().ChildOf) {
          getAgentName(docSnap.data().ChildOf);
        } else {
          setSponcerName("None");
        }
      }
      setisloading(false);
    }
  }
  async function getAgentName(id) {
    const docRef = doc(db, "Agent", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data());
      setSponcerName(docSnap.data().Name);
    }
  }
  async function getUserStatus(id) {
    const docRef = doc(db, "Users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(docSnap.data());
      setUserStatus(docSnap.data().Blocked || false);
    }
  }
  async function getPlotsData(Plots) {
    var tempList = [];

    for (const plot_id in Plots) {
      const id = Plots[plot_id];

      const docRef = doc(db, "Plots", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        var temp = docSnap.data();
        temp["id"] = id;
        tempList.push(temp);
      }
    }
    setPlots(tempList);
  }
  const openDocModal = () => {
    setShowDocModal(true);
  };

  const closeDocModal = () => {
    setShowDocModal(false);
  };
  async function toggleBlock() {
    const AgentRef = doc(db, "Users", prams.id);

    await updateDoc(AgentRef, {
      Blocked: !UserStatus,
    }).then(() => {
      setisloading(true);
      getUserStatus(prams.id);
      setisloading(false);
    });
  }
  return isloading ? (
    <Loader />
  ) : (
    <>
      <SideBar
        element={
          isloading ? (
            <Loader />
          ) : (
            <>
              <div className="ClientDetails">
                <div>
                  <div className="info-box">
                    <div className="client-pic">
                      {/* <h1>Customer Information</h1> */}
                      <div className="client-pic-detail">
                        <img
                          className="avatar"
                          src={
                            userData.Gender === "female"
                              ? isAdmin()
                                ? userData.imgUrl
                                : "avatar"
                              : userData.imgUrl
                          }
                          alt="User"
                          style={{ maxWidth: "100px" }}
                        />
                        <div className="cus-details">
                          <h2>{userData.Name}</h2>
                          <span>Agent details</span>
                        </div>
                      </div>
                      <br />
                      {/* <span>info@infogmail.com</span> */}
                      <br />
                      {/* <span>+92 317 5545690</span> */}
                      <div className="clients-buttons">
                        <div className="button-pair">
                          <button onClick={openDocModal}>
                            {/* <img src={edit} alt="" /> */}
                            <p>Add Docs </p>
                          </button>
                          {/* <button></button> */}
                        </div>
                        {isAdmin() && (
                          <div className="button-pair">
                            <button
                              onClick={() =>
                                navigate(`/edit/agent/${userData.Cnic}`)
                              }
                            >
                              {/* <img src={edit} alt="" /> */}
                              <p>Edit Profile </p>
                            </button>
                            {/* <button> */}
                            {/* <img src={edit} alt="" /> */}
                            {/* <p>Delete Profile</p> */}
                            {/* </button> */}
                          </div>
                        )}
                      </div>
                      <button
                        className={`soloButton  ${UserStatus ? "Blocked" : ""}
                            `}
                        onClick={toggleBlock}
                      >
                        {!UserStatus ? "Block" : "Unblock"} Agent
                      </button>
                    </div>
                    <div className="info-box-2">
                      <h1>Agent Information</h1>
                      <div className="sec-heading">
                        <span className="first-text">Address:</span>
                        <span className="secon-text">{userData.Address}</span>
                      </div>
                      <div className="data-client">
                        <div className="data-client-div">
                          <div className="row">
                            <span>Name:</span>
                            <span>F/H Name:</span>
                            <span>CNIC:</span>
                            <span>Gender:</span>
                            <span>DOB:</span>
                          </div>
                          <div className="row">
                            <span className="secon-row">{userData.Name}</span>
                            <span className="secon-row">{userData.FName}</span>
                            <span className="secon-row">
                              {isAdmin() && cnicFormat(userData.Cnic)}
                            </span>
                            <span className="secon-row">{userData.Gender}</span>
                            <span className="secon-row">{userData.Dob}</span>
                          </div>
                        </div>
                        <div className="data-client-div">
                          <div className="row">
                            <span>Phone Number:</span>
                            <span>Town City:</span>
                            <span>Invoice ID:</span>
                            <span>Created By:</span>
                            <span>Sponsored By:</span>
                          </div>
                          <div className="row">
                            <span className="secon-row">{userData.phNo}</span>
                            <span className="secon-row">
                              {userData["TownCity"]}
                            </span>

                            <span className="secon-row">
                              {userData["InvId"]}
                            </span>
                            <span className="secon-row">
                              {userData["createdBy"]
                                ? userData["createdBy"]
                                : "None"}
                            </span>
                            <span className="secon-row">{SponcerName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isAdmin() && (
                    <div className="AgentRef">
                      <div className="doc-row">
                        <h1>Documents</h1>
                        {/* <button>Add Document</button> */}
                      </div>
                      <table className="fl-table">
                        <thead>
                          <th>Title</th>

                          <th>Acitons</th>
                        </thead>
                        <tbody>
                          {userData.Documents &&
                            Object.entries(userData.Documents).map(
                              ([key, value]) => (
                                <tr>
                                  <td>{key}</td>

                                  <td>
                                    <a
                                      href={value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      view
                                    </a>
                                  </td>
                                </tr>
                              )
                            )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="plots">
                    <h1>Plots Details</h1>
                    <div className="plot-cards">
                      {Plots.map((plot) => (
                        <div className="card">
                          <h4>{plot.id}</h4>
                          <div className="plot-des"></div>
                          <div className="row-start">
                            <PiBuildingsBold className="buildlogo" />
                            <span>Category :</span>
                            <h2>{plot.Category}</h2>
                          </div>

                          <div className="view-more">
                            <button
                              onClick={() => {
                                navigate(`/details/plot/${plot.id}`);
                              }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      />

      <AddDocsAgent
        showModal={showDocModal}
        onClose={closeDocModal}
        olddocs={userData.Documents}
        uid={userData.Cnic}
      />
    </>
  );
}

export default AgentDetails;
