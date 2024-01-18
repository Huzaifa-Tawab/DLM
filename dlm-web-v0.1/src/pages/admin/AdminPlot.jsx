import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import AddTransactions from "../../components/Modals/AddTransactions";
import TransferPlot from "../../components/Modals/TransferPlot";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import './adminplot.css'
import avatar from '../../Assets/avatar.png'
import './ClientDetails.css'
function AdminPlot() {
  const prams = useParams();
  const id = prams.id;

  const [PlotDetails, setPlotDetails] = useState({});
  const [isLoading, setisLoading] = useState(true);
  const [Transactions, setTransactions] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    getPlotDetails();
    getTransactions();
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
  async function getTransactions() {
    const q = query(
      collection(db, "Transactions"),
      where("fileNumber", "==", id)
    );

    const querySnapshot = await getDocs(q);

    let temp = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      let single = doc.data();
      single["id"] = doc.id;
      temp.push(single);
    });
    setTransactions(temp);
  }
  const openDocModal = () => {
    setShowDocModal(true);
  };

  const closeDocModal = () => {
    setShowDocModal(false);
  };
  const openTransferModal = () => {
    setShowTransferModal(true);
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
  };
  return isLoading ? (
    <Loader />
  ) : (
    <>
    <Header/>
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
                  <span>Customer ID:</span>
                  <span>City/Town</span>
                  </div>
                  <div className="row">
                    <span className="secon-row">{PlotDetails.PlotSize}</span>
                    <span className="secon-row">{PlotDetails.AgentId}</span>
                    <span className="secon-row">{PlotDetails.CustomerId}</span>
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
                  <span className="secon-row">{PlotDetails.paidAmount}</span>
                  <span className="secon-row">{PlotDetails.TotalAmount}</span>
                </div>
            </div>
            <div className="column">
          
        <button className="red-color"
          onClick={() => {
            setShowTransferModal(true);
          }}
        >
          Transfer
        </button>
        <button className="red-color">Print</button>
        <button className="yellow-color"
          onClick={() => {
            setShowDocModal(true);
          }}
        >
          Payment
        </button>
        <button className="yellow-color">Comment</button>
            </div>

            </div>
         
       
        </div>
        <div className="bottom-part-plot">
        <div className="transaction-box">
          <h1>Recent Transaction</h1>
          {Transactions.map((transaction, index) =>(
          <div key={index} className="transaction-heading">
          <span className="first">Agent Name:</span>
           <span className="second">{transaction.agentName}</span>
          <br />
          <span className="first">Agent ID:</span>
          <span className="second">{transaction.agentID}</span>
          <br />
          <span className="first">Customer Name:</span>
          <span className="second">{transaction.customerName}</span>
          <br />
          <span className="first">Customer ID:</span>
          <span className="second">{transaction.customerID}</span>
          <br />
          <span className="first">File Number:</span>
          <span className="second">{transaction.fileNumber}</span>
          <br />
          <span className="first">Nature:</span>
          <span className="second">{transaction.nature}</span>
          <br />
          <span className="first">Payment:</span>
          <span className="second">{transaction.payment}</span>
          <br />
          <span className="first">Penalty:</span>
          <span className="second">{transaction.penalty}</span>
          <br />
          <span className="first">Time:</span>
          <span className="second">{}</span>
          <br />
          <span className="first">Proof:</span>
         <a href={transaction.proof} target="_blank" rel="noopener noreferre" style={{textDecoration: "none"}}> <span className="second">Click Here for Proof</span></a>
          </div>
          

 
          ))}
         
        </div>
        <div className="comment-box">
          <h1>Comments   <span>13</span></h1>
          <div className="comment-box-top">
            <div className="img-name">
              <img src={avatar} alt="" style={{width: "50px"}}/>
              <div className="name-cat">
                <h2>Ahmed</h2>
                <span>Sub Admin</span>
              </div>
            </div>
            <span>Date</span>
          </div>
          <p>We are very happy with the service from the MORENT App. Morent has a low price and also a large variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.</p>
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
      />
      <Footer/>
    </>
  );
}

export default AdminPlot;
