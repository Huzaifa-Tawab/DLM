import React, { useState } from "react";
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

function AddTransactions({ showModal, onClose, cid, aid, pid, cata }) {
  // State to store uploaded file
  const [file, setFile] = useState("");
  const [Amount, setAmount] = useState(0);
  const [PAmount, setPAmount] = useState(0);
  const [Tamount, setTamount] = useState(0);
  const [Lamount, setLamount] = useState(0);

  // progress
  const [percent, setPercent] = useState(0);

  // Handle file upload event and update state
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
  function uploadToFirebase() {
    const storageRef = ref(storage, `/Transactions/${pid}/${getDate()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
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

    const PCdocSnap = await getDoc(doc(db, "PlotCategories", cata));
    if (PCdocSnap.exists()) {
      catagory = PCdocSnap.data();
      paidAmount = catagory.InstallmentAmount + catagory.PaidAmount;
    }

    const CdocSnap = await getDoc(doc(db, "Customers", cid));
    if (CdocSnap.exists()) {
      let lastpaymentTime = CdocSnap.data().lastPayment;
      console.log(lastpaymentTime);

      const dateLast = new Date(lastpaymentTime.seconds * 1000);
      const dateNow = new Date(); // Use the current date

      // Calculate the difference in months
      const monthDifference =
        (dateNow.getFullYear() - dateLast.getFullYear()) * 12 +
        (dateNow.getMonth() - dateLast.getMonth());

      console.log("Month Difference:", monthDifference);

      if (monthDifference >= 2 && dateNow.getDate() >= 10) {
        // Apply penalty for the initial 2 months
        let penalty = 1000;

        // Add 500 for every month beyond the initial 2 months
        for (let i = 2; i < monthDifference; i++) {
          penalty += 500;
        }

        console.log("Penalty Applied:", penalty);
        setPAmount(penalty);
      }
    }
    const PlotdocSnap = await getDoc(doc(db, "Plots", pid));
    if (PlotdocSnap.exists()) {
      plot = PlotdocSnap.data();
    }
    const AdocSnap = await getDoc(doc(db, "Agent", aid));
    if (AdocSnap.exists()) {
      console.log(AdocSnap.data());
      agent = AdocSnap.data();
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

    await setDoc(doc(db, "Transactions", randomNum), {
      fileNumber: pid,
      agentID: aid,
      proof: url,
      penalty: penalty,
      payment: catagory.InstallmentAmount,
    });

    await updateDoc(doc(db, "Plots", pid), {
      lastPayment: serverTimestamp(),
      paidAmount: paidAmount,
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
      <button onClick={onClose}>Close Modal</button>
      <div>
        <h1>
          istallment No {plot.installmentNo}/{catagory.TotalInstallments}
        </h1>
        <div className="textfieldgroup-col">
          <p>Amount</p>
          <input disabled type="number" value={Amount} />
        </div>
        <div className="textfieldgroup-col">
          <p>Total Amount</p>
          <input disabled type="number" value={Tamount} />
        </div>
        <div className="textfieldgroup-col">
          <p>left Amount</p>
          <input disabled type="number" value={Lamount} />
        </div>
        <div className="textfieldgroup-col">
          <p>left Amount</p>
          <input disabled type="number" value={Lamount} />
        </div>
        <input type="file" onChange={handleChange} accept="/image/*" />
        <button onClick={handleUpload}>Submit</button>
        <p>{percent} "% done"</p>
      </div>
    </Modal>
  );
}

export default AddTransactions;
