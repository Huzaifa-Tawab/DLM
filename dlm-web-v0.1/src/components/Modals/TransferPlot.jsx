import React, { useEffect, useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { update } from "lodash";
import Select from "react-select";
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
import xIcon from "../../assets/Xincon.png";

function TransferPlot({ showModal, onClose, cid, aid, pid }) {
  const [file, setFile] = useState();
  const [Plot, setPlot] = useState({});
  const [receiverCustomer, setReceiverCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  const [Amount, setAmount] = useState(0);

  useEffect(() => {
    loadOptions();
  }, []);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const loadOptions = async () => {
    // perform a request
    const querySnapshot = await getDocs(collection(db, "Customers"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().id !== cid) {
        newCustomersData.push({ label: doc.data().Name, value: doc.id });
      }
    });
    console.log(newCustomersData);
    setCustomers(newCustomersData);
  };
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
      (snapshot) => {},
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
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
    const CustomerSnap = await getDoc(doc(db, "Customers", cid));
    if (CustomerSnap.exists()) {
      customer = CustomerSnap.data();
      console.log(customer);
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

    await setDoc(doc(db, "Transactions", randomNum), {
      fileNumber: pid,
      agentID: aid,
      agentName: agent.Name + " " + agent.FName,
      senderCustomerName: customer.Name,
      senderCustomerID: cid,
      receiverCustomerName: receiverCustomer.label,
      receiverCustomerID: receiverCustomer.value,
      proof: url,
      customerName: receiverCustomer.label,
      payment: Amount,
      InvId: randomNum,
      verified: false,
      nature: "transfer",
      time: serverTimestamp(),
    });

    await updateDoc(doc(db, "Plots", pid), {
      CustomerId: receiverCustomer.value,
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
      <h2>Transfer </h2>
      <div className="closebutton">
        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      <div>
        {customers && (
          <Select
            options={customers}
            onChange={(opt) => setReceiverCustomer(opt)}
          />
        )}
        <div className="modal-field-group">
          <p>Amount</p>
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
            value={Amount}
          />
        </div>
        <div className="modal-field-group">
          <p>Select Your File</p>
          <input type="file" onChange={handleChange} accept="/image/*" />
        </div>
        <button className="modal-button" onClick={handleUpload}>
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default TransferPlot;
