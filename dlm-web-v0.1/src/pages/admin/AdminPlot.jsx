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
      <div>
        <h1>Plot Information</h1>
        <ul>
          <li>
            <strong>Plot Size:</strong> {PlotDetails.PlotSize}
          </li>
          <li>
            <strong>Agent ID:</strong> {PlotDetails.AgentId}
          </li>
          <li>
            <strong>Customer ID:</strong> {PlotDetails.CustomerId}
          </li>
          <li>
            <strong>City/Town:</strong> {PlotDetails.CityTown}
          </li>
          <li>
            <strong>Address:</strong> {PlotDetails.Address}
          </li>
          <li>
            <strong>File Number:</strong> {PlotDetails.FileNumber}
          </li>
          <li>
            <strong>Category:</strong> {PlotDetails.Category}
          </li>
          <li>
            <strong>Paid Amount:</strong> {PlotDetails.paidAmount}
          </li>
          <li>
            <strong>Total Amount:</strong> {PlotDetails.TotalAmount}
          </li>
        </ul>
        <div>
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
                {/* {new Date(
                  transaction.time.seconds * 1000 +
                    transaction.time.nanoseconds / 1000000
                ).toLocaleString()} */}
                <br />
                <strong>Customer Name:</strong> {transaction.customerName}
                <br />
                <hr />
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => {
            setShowDocModal(true);
          }}
        >
          Add
        </button>
        <button
          onClick={() => {
            setShowDocModal(true);
          }}
        >
          Add
        </button>
      </div>
      <AddTransactions
        showModal={showDocModal}
        onClose={closeDocModal}
        cid={PlotDetails.CustomerId}
        aid={PlotDetails.AgentId}
        pid={PlotDetails.FileNumber}
        cata={PlotDetails.Category}
      />
    </>
  );
}

export default AdminPlot;
