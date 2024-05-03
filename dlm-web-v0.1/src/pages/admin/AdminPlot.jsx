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
} from "firebase/firestore";
import { db } from "../../firebase";
import AddTransactions from "../../components/Modals/AddTransactions";
import TransferPlot from "../../components/Modals/TransferPlot";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import "./adminplot.css";
import avatar from "../../Assets/avatar.png";
import "./clientdetails.css";
import AddComments from "../../components/Modals/AddComments";
import isAdmin from "../../../IsAdmin";
import SideBar from "../../components/Sidebar/sidebar";
function AdminPlot() {
  const prams = useParams();
  const navigate = useNavigate();

  const id = prams.id;

  const [PlotDetails, setPlotDetails] = useState({});
  const [isLoading, setisLoading] = useState(true);
  const [Transactions, setTransactions] = useState([]);
  const [Comments, setComments] = useState([]);
  const [isBlocked, setisBlocked] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  useEffect(() => {
    getPlotDetails();
    getTransactions();
    getPlotComments();
  }, []);
  async function getPlotComments() {
    const q = query(collection(db, "Comments"), where("pid", "==", id));
    const querySnapshot = await getDocs(q);
    let temp = [];
    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });
    setComments(temp);
  }
  async function getPlotDetails() {
    const docRef = doc(db, "Plots", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setPlotDetails(docSnap.data());
      console.log(docSnap.data());
      setisBlocked(docSnap.data().Blocked);
      setisLoading(false);
    }
  }
  async function toggleBlockStatus() {
    setisLoading(true);
    const Ref = doc(db, "Plots", id);
    await updateDoc(Ref, {
      Blocked: !isBlocked,
    }).then(() => {
      getPlotDetails();
      setisLoading(false);
    });
  }
  async function getTransactions() {
    const q = query(
      collection(db, "Transactions"),
      where("fileNumber", "==", id)
    );

    const querySnapshot = await getDocs(q);

    let temp = [];
    querySnapshot.forEach((doc) => {
      // if (doc.data()["varified"]) {
      let single = doc.data();
      single["id"] = doc.id;
      temp.push(single);
      // }
    });
    setTransactions(temp);
  }
  const openDocModal = () => {
    setShowDocModal(true);
  };

  const closeDocModal = () => {
    setShowDocModal(false);
    getPlotDetails()
  };
  const openTransferModal = () => {
    setShowTransferModal(true);
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
  };
  const openCommentsModal = () => {
    setShowCommentsModal(true);
  };

  const closeCommentsModal = () => {
    setShowCommentsModal(false);
  };
  function getTime(ms) {
    const temp = new Date(ms).toDateString();
    return temp;
  }
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
                  <span className="first-text">Address:</span>{" "}
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
                  </div>
                  <div className="row">
                    <span className="secon-row">{PlotDetails.FileNumber}</span>
                    <span className="secon-row">{PlotDetails.Category}</span>
                    <span className="secon-row">
                      {PlotDetails.paidAmount ? PlotDetails.paidAmount : 0}
                    </span>
                    <span className="secon-row">{PlotDetails.TotalAmount}</span>
                  </div>
                </div>

                <div className="column">
                  {isAdmin() && (
                    <>
                      <button
                        className="red-color"
                        onClick={() => {
                          setShowTransferModal(true);
                        }}
                      >
                        Transfer
                      </button>
                      <button
                        className="red-color"
                        onClick={() => {
                          navigate(`/print/${PlotDetails.FileNumber}`);
                        }}
                      >
                        Print
                      </button>
                    </>
                  )}
                  {!isAdmin() && (
                    <button
                      className="yellow-color"
                      onClick={() => {
if (PlotDetails.invoicePending) {
  alert("Alreay Sent One Invoice For Aproval")
}else{
  setShowDocModal(true);  

}
                      }}
                    >
                      Payment
                    </button>
                  )}

                  <button
                    className="yellow-color"
                    onClick={() => {
                      setShowCommentsModal(true);
                    }}
                  >
                    Comment
                  </button>
                  <button
                    className="yellow-color"
                    onClick={() => {
                      navigate(`/print/schedule/${PlotDetails.FileNumber}`);
                    }}
                  >
                    Schedule
                  </button>
                  {isAdmin() && (
                    <button
                      className="yellow-color"
                      onClick={() => navigate(`/edit/plot/${id}`)}
                    >
                      Edit
                    </button>
                  )}
                  {isAdmin() && (
                    <button
                      className="yellow-color"
                      onClick={toggleBlockStatus}
                    >
                      {isBlocked ? "Un Block" : "Block"}File
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="bottom-part-plot">
              <div className="transaction-box">
                <h1>Transaction</h1>
                {Transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="transaction-main"
                    onClick={() => {
                      if (transaction["varified"]) {
                        navigate(`/print/invoice/${transaction.InvId}`);
                      }
                    }}
                  >
                    <div className="transaction-row">
                      <span className="trans-id">{transaction.InvId}</span>
                      <span className="trans-id">{transaction.nature}</span>
                      <span className="comntbox-date">
                        {getTime(transaction.time.seconds * 1000)}
                      </span>
                    </div>
                    <div className="transaction-row">
                      <span>
                        <strong>Submited to:</strong> {transaction.agentName}
                      </span>
                      <span>
                        {/* <strong>Status</strong>{" "} */}
                        {/* {transaction["varified"] ? "Verified" : "Pending"} */}
                      </span>

                      <span>PKR {transaction.total}</span>
                    </div>
                    <div className="transaction-row">
                      <span>
                        <strong>Approved by :</strong>{" "}
                        {transaction.verifiedBy
                          ? transaction.verifiedBy
                          : "Pending"}
                      </span>

                      <span></span>
                    </div>

                    {/* <a
                  href={transaction.proof}
                  target="_blank"
                  rel="noopener noreferre"
                  style={{ textDecoration: "none" }}
                >
                  {" "}
                  <span className="second">Click Here for Proof</span>
                </a> */}
                  </div>
                ))}
              </div>
              <div className="comment-box">
                <h1>
                  Comments <span>{Comments.length}</span>
                </h1>

                {Comments.map((e, i) => (
                  <div key={i} className="box-bg">
                    <div className="comment-box-top">
                      <div className="img-name">
                        <img
                          className="img-commnt"
                          src={avatar}
                          alt=""
                          style={{ widh: "50px" }}
                        />
                        <div className="name-cat">
                          <h2 className="comntbox-h2">{e.by}</h2>
                          <span className="comntbox-span">{e.userType}</span>
                        </div>
                      </div>
                      <span className="comntbox-date">
                        {getTime(e.created.seconds * 1000)}
                      </span>
                    </div>
                    <p className="coment-desc">{e.comment}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* <div>
          <ul style={{ background: "red", margin: "10px" }}>
            {Transactions.map((transaction, index) => (
              <li key={index}>
                <strong>Proof:</strong>{" "}
                <a
                  href={transaction.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {transaction.proof}
                </a>
                <br />
                <strong>Penalty:</strong> {transaction.penalty}
                <br />
                <strong>Agent Name:</strong> {transaction.agentName}
                <br />
                <strong>File Number:</strong> {transaction.fileNumber}
                <br />
                <strong>Agent ID:</strong> {transaction.agentID}
                <br />
                <strong>Nature:</strong> {transaction.nature}
                <br />
                <strong>Customer ID:</strong> {transaction.customerID}
                <br />
                <strong>Payment:</strong> {transaction.payment}
                <br />
                <strong>Time:</strong>{" "}
                {new Date(
                  transaction.time.seconds * 1000 +
                    transaction.time.nanoseconds / 1000000
                ).toLocaleString()}
                <br />
                <strong>Customer Name:</strong> {transaction.customerName}
                <br />
                <hr />
              </li>
            ))}
          </ul>
        </div> */}
          </div>
        }
      />

      <AddTransactions
        showModal={showDocModal}
        onClose={closeDocModal}
        cid={PlotDetails.CustomerId}
        aid={PlotDetails.AgentId}
        pid={PlotDetails.FileNumber}
        cata={PlotDetails.Category}
      />
      <TransferPlot
        showModal={showTransferModal}
        onClose={closeTransferModal}
        pid={PlotDetails.FileNumber}
        cid={PlotDetails.CustomerId}
        aid={PlotDetails.AgentId}
      />
      <AddComments
        showModal={showCommentsModal}
        onClose={closeCommentsModal}
        plotid={id}
      />
    </>
  );
}

export default AdminPlot;
