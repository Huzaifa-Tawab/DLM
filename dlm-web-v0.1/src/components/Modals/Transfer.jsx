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

function Transfer({ showModal, onClose, cid, aid, pid, cata }) {
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState();
  const [Plot, setPlot] = useState({});
  // Handle file upload event and update state
  const [penalty, setPenalty] = useState(0);
  const [NumberOfPenelties, setNumberOfPenelties] = useState(0);
  const [Amount, setAmount] = useState(0);
  const [CustomerNameList, setCustomerNameList] = useState({});

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
    const AdocSnap = await getDoc(doc(db, "Agent", aid));

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
    let penalty = 0;
    let customer = {};
    let plot = {};
    let agent = {};

    const PlotdocSnap = await getDoc(doc(db, "Plots", pid));
    if (PlotdocSnap.exists()) {
      plot = PlotdocSnap.data();
    }
    const querySnapshot = await getDocs(collection(db, "Customers"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(
        doc.id,
        " => ",
        doc.data()["Name"] + "" + doc.data()["FName"]
      );
    });
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
      customerName: customer.Name + " " + customer.FName,
      customerID: cid,
      proof: url,
      penalty: penalty,

      nature: "installment",
      time: serverTimestamp(),
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
        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      <div>
       
          <span className="first">Installment no:</span>
          <span className="second">{Plot.installmentNo}/{catagory.TotalInstallments}</span>
          <br />
       
        <span className="first">Pending Installments:</span>
        <span className="second">{NumberOfPenelties}</span>
       
        <div className="modal-field-group">
          <p>Amount</p>
          <input disabled type="number" value={Amount} />
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
        <p>Please Select File</p>
        <input type="file" onChange={handleChange} accept="/image/*" />
        </div>
        <button className="modal-button" onClick={handleUpload}>Submit</button>
        <p style={{textAlign: "center"}}>{percent}% done</p>
      </div>
    </Modal>
  );
}

export default Transfer;
