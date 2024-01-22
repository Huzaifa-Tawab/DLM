import React, { useEffect, useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { update } from "lodash";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import getDate from "../../../GetDDMMYY";
// import xIcon from "../../assets/Xincon.png";

function AddTransactions({ showModal, onClose, cid, aid, pid, cata }) {
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState();
  const [Plot, setPlot] = useState({});
  const [catagory, setcatagory] = useState({});
  // Handle file upload event and update state
  const [penalty, setPenalty] = useState(0);
  const [NumberOfPenelties, setNumberOfPenelties] = useState(0);
  const [Amount, setAmount] = useState(0);
  const [PendingInstallments, setPendingInstallments] = useState(0);

  useEffect(() => {
    getDataFromDb();
  }, []);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const handleUpload = () => {
    if (!file) {
      alert("Please upload an image first!");
    } else {
      uploadToFirebase();
    }
  };
  async function getDataFromDb() {
    let installmentAmount = 0;
    let i = 1;
    let lastpaymentTime;
    const PlotdocSnap = await getDoc(doc(db, "Plots", pid));
    const CatadocSnap = await getDoc(doc(db, "PlotCategories", cata));
    const AdocSnap = await getDoc(doc(db, "Agent", aid));
    if (PlotdocSnap.exists()) {
      setPlot(PlotdocSnap.data());
      console.log(PlotdocSnap.data());
      lastpaymentTime = PlotdocSnap.data().lastPayment;

      const dateLast = new Date(lastpaymentTime.seconds * 1000);
      const dateNow = new Date(); // Use the current date
      // Calculate the difference in months
      const monthDifference =
        (dateNow.getFullYear() - dateLast.getFullYear()) * 12 +
        (dateNow.getMonth() - dateLast.getMonth());
      console.log("Month Difference:", monthDifference);
      let penalty = 0;
      if (monthDifference >= 2 && dateNow.getDate() >= 10) {
        // Apply penalty for the initial 2 months
        penalty = 1000;
        i = 2;
        // Add 500 for every month beyond the initial 2 months
        for (i; i < monthDifference; i++) {
          penalty += 500;
        }
      }
      setPenalty(penalty);
      setNumberOfPenelties(i);
    }
    if (CatadocSnap.exists()) {
      setcatagory(CatadocSnap.data());
      installmentAmount = CatadocSnap.data().InstallmentAmount;
      console.log(CatadocSnap.data());
      setAmount(installmentAmount);
    }
    if (AdocSnap.exists()) {
      console.log(AdocSnap.data());
      setDoc(AdocSnap.data());
    }
  }
  function uploadToFirebase() {
    const storageRef = ref(storage, `/Transactions/${pid}/${getDate()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          //   olddocs[Amount] = url;
          uploadTansaction(url);
        });
      }
    );
  }
  async function uploadTansaction(url) {
    let randomNum = 0;
    let TSize = 1;
    let paidAmount = 0;
    let penalty = 0;
    let customer = {};
    let catagory = {};
    let plot = {};
    let agent = {};
    console.log("cata1", cata);
    const PlotCategoriesSnap = await getDoc(doc(db, "PlotCategories", cata));
    if (PlotCategoriesSnap.exists()) {
      catagory = PlotCategoriesSnap.data();
      console.log("cata", catagory);
    }

    const PlotdocSnap = await getDoc(doc(db, "Plots", pid));
    if (PlotdocSnap.exists()) {
      plot = PlotdocSnap.data();
    }
    const CustomerdocSnap = await getDoc(doc(db, "Customers", cid));
    if (CustomerdocSnap.exists()) {
      customer = CustomerdocSnap.data();
    }
    const AgentSnap = await getDoc(doc(db, "Agent", aid));
    if (AgentSnap.exists()) {
      agent = AgentSnap.data();
    }
    while (!TSize == 0) {
      randomNum = `INV-${
        agent.InvId + (Math.floor(Math.random() * 1000000) + 1)
      }`;

      const querySnapshotT = await getDocs(
        query(collection(db, "Transactions"), where("id", "==", randomNum))
      );
      TSize = querySnapshotT.size;
    }
    console.log(randomNum);
    await setDoc(doc(db, "Transactions", randomNum), {
      fileNumber: pid,
      agentID: aid,
      agentName: agent.Name + " " + agent.FName,
      customerName: customer.Name,
      customerLastName: customer.FName,
      customerID: cid,
      proof: url,
      penalty: penalty,
      payment: Amount,
      total: parseInt(penalty) + parseInt(Amount),
      nature: "installment",
      time: serverTimestamp(),
      InvId: randomNum,
      Category: cata,
      varified: false,
    });

    await updateDoc(doc(db, "Plots", pid), {
      lastPayment: serverTimestamp(),
      paidAmount:
        parseInt(Plot.paidAmount) + parseInt(Amount) + parseInt(penalty),
      installmentNo: parseInt(Plot.installmentNo) + 1,
    });

    onClose();
  }
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
      closeOnOuterClick={true}
    >
      <h2>Add Transactions</h2>
      <div className="closebutton">
        {/* <img onClick={onClose} src={xIcon} alt="" /> */}
      </div>
      <div>
        <span className="first">Installment No:</span>
        <span className="second">
          {Plot.installmentNo}/{catagory.TotalInstallments}
        </span>
        <br />
        <span className="first">Pending installments:</span>
        <span className="seconf">{NumberOfPenelties}</span>

        <div className="modal-field-group">
          <p>Amount</p>

          <input
            type="number"
            placeholder="Amount"
            value={Amount}
            onChange={(e) => {
              if (parseInt(e.target.value) > 0) {
                setAmount(parseInt(e.target.value));
              }
            }}
          />
        </div>

        <div className="modal-field-group">
          <p>Pnaly</p>
          <input disabled type="number" value={penalty} />
        </div>
        <div className="modal-field-group">
          <p>Total</p>
          <input
            disabled
            type="number"
            value={parseInt(Amount) + parseInt(penalty)}
          />
        </div>
        <div className="modal-field-group">
          <p>Select Your File</p>
          {/* <input type="file" onChange={handleChange} accept="/image/*" /> */}
        </div>

        <button className="modal-button" onClick={handleUpload}>
          Submit
        </button>
        <p style={{ textAlign: "center" }}>{percent}% done</p>
      </div>
    </Modal>
  );
}

export default AddTransactions;
