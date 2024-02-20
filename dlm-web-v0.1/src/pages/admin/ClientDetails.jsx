import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./clientdetails.css";

import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import AddDocs from "../../components/Modals/AddDocs";
import { PiBuildingsBold } from "react-icons/pi";
import isAdmin from "../../../IsAdmin";
import adddoc from "../../Assets/adddoc.svg";
import plot from "../../Assets/plot.svg";
import profile from "../../Assets/profile.svg";
import block from "../../Assets/block.svg";
import downtown from "../../Assets/Downtown.svg";
import SideBar from "../../components/Sidebar/sidebar";
import cnicFormat from "../../../cnicFormatter";

function ClientDetails() {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(true);
  const [userData, setData] = useState();
  const [Plots, setPlots] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [UserDocs, setUseDocs] = useState({});

  const prams = useParams();

  useEffect(() => {
    getdata();
  }, []);

  async function getdata() {
    const docRef = doc(db, "Customers", prams.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setData(docSnap.data());

      if (docSnap.data().Plots != null) {
        console.log("ok");
        getPlotsData(docSnap.data().Plots);
        setUseDocs(docSnap.data().Document);
      }
      setisloading(false);
    }
  }
  async function toggleBlockStatus() {
    setisloading(true);
    const Ref = doc(db, "Customers", prams.id);
    await updateDoc(Ref, {
      Blocked: !userData.Blocked,
    }).then(() => {
      getdata();
      setisloading(false);
    });
  }
  async function getPlotsData(Plots) {
    console.log(Plots);
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
  return isloading ? (
    <Loader />
  ) : (
    <>
      <SideBar
        element={
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
                              : ""
                            : userData.imgUrl
                        }
                        alt="User"
                        // style={{ maxWidth: "100px" }}
                      />
                      <div className="cus-details">
                        <h2>{userData.Name}</h2>
                        <span>Customer</span>
                      </div>
                    </div>
                    {/* <span>info@infogmail.com</span> */}

                    {/* <span>+92 317 5545690</span> */}
                    <div className="clients-buttons">
                      <div className="button-pair">
                        {isAdmin() && (
                          <button
                            onClick={() => {
                              navigate(`/edit/client/${userData.Cnic}`);
                            }}
                          >
                            <img src={profile} alt="" />
                            <p>Edit Profile </p>
                          </button>
                        )}

                        {!isAdmin() && (
                          <button
                            onClick={() => {
                              navigate("/create/plot/", {
                                state: {
                                  Cuid: userData.Cnic,
                                },
                              });
                            }}
                          >
                            <img src={plot} alt="" />
                            <p>Add Plot </p>
                          </button>
                        )}
                      </div>

                      <div className="button-pair ">
                        {isAdmin() && (
                          <button
                            onClick={toggleBlockStatus}
                            className={userData.Blocked && "blocked-user"}
                          >
                            <img src={block} alt="" />
                            <p>{userData.Blocked ? "unblock" : "block"}</p>
                          </button>
                        )}
                        {/* <button onClick={openDocModal}>
                          <img src={adddoc} alt="" />
                          <p>Add Doc</p>
                        </button> */}
                      </div>
                    </div>
                  </div>
                  <div className="info-box-2">
                    <h1>Customer Information</h1>
                    <div className="sec-heading">
                      <span className="first-text">Address:</span>{" "}
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
                            {isAdmin()
                              ? cnicFormat(userData.Cnic)
                              : "************"}
                          </span>
                          <span className="secon-row">{userData.Gender}</span>
                          <span className="secon-row">{userData.Dob}</span>
                        </div>
                      </div>
                      <div className="data-client-div">
                        <div className="row">
                          <span>Phone Number:</span>
                          <span>Town City:</span>

                          <span>Kin Relation:</span>

                          <span>Next of Kin:</span>
                        </div>
                        <div className="row">
                          <span className="secon-row">{userData.phNo}</span>
                          <span className="secon-row">
                            {userData["TownCity"]}
                          </span>
                          <span className="secon-row">
                            {userData.KinRelation}
                          </span>
                          <span className="secon-row">
                            {userData.NexttoKin}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="documents">
                  <div className="doc-row">
                    <h1>Documents</h1>

                    <button className="doc-button" onClick={openDocModal}>
                      <img src={adddoc} alt="" />
                      Add Document
                    </button>
                  </div>
                  {isAdmin() && (
                    <table className="fl-table">
                      <thead>
                        <th>Document Name</th>

                        <th>More Details</th>
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
                  )}
                </div>
                <div className="plots">
                  {/* <h1>Plots Details</h1> */}
                  <div className="plot-cards">
                    {Plots.map((plot) => (
                      <div className="card">
                        <h4>{plot.FileNumber}</h4>
                        <span className="first" style={{ color: "#fff" }}>
                          {userData.Address}
                        </span>

                        <div className="plot-des">
                          <span>
                            {" "}
                            <strong>Agent Name:</strong> {plot.AgentName}
                          </span>
                          <br />
                          <span>
                            <strong>Cnic:</strong> {plot.AgentId}
                          </span>
                        </div>
                        <div className="row-start">
                          <img src={downtown} alt="" />

                          <span>{plot.Category}</span>
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
        }
      />

      <AddDocs
        showModal={showDocModal}
        onClose={closeDocModal}
        olddocs={userData.Documents}
        uid={userData.Cnic}
      />
    </>
  );
}

export default ClientDetails;
