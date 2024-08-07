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
import xIcon from "../../Assets/Xincon.png";

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
  const [DisableButton, setDisableButton] = useState(false);
  const [NoOfInstallments, setNoOfInstallments] = useState(1);

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [newInstallmentAmount, setnewInstallmentAmount] = useState(false);
  useEffect(() => {
    getDataFromDb();
  }, [0]);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const handleUpload = () => {
    console.log(newInstallmentAmount);
    if (!newInstallmentAmount) {
      alert("Please Set Installment Amount First ");
      onClose();
    } else {
      setDisableButton(true);
      if (!file) {
        // setDisableButton(false);
        // alert("Please upload an image first!");

        uploadTansaction(
          "https://firebasestorage.googleapis.com/v0/b/dlm-webapp.appspot.com/o/Heliotrope-1_075509-1024x288.webp?alt=media&token=201e7d47-c9b9-487b-80bf-2393c69f1184"
        );
      } else {
        uploadToFirebase();
      }
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
      console.log("ffff", PlotdocSnap.data().instamentVerified);
      if (!PlotdocSnap.data().instamentVerified) {
        try {
          let x = parseInt(
            prompt(
              "please set Up Installment amount once you set it it can not be changed"
            )
          );
          while (!x) {
            x = parseInt(
              prompt(
                "please set Up Installment amount once you set it it can not be changed"
              )
            );
          }
          await updateDoc(doc(db, "Plots", pid), {
            instamentVerified: true,
            Installment: x,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        setnewInstallmentAmount(true);
      }
      setPlot(PlotdocSnap.data());
      setAmount(PlotdocSnap.data().Installment);

      console.log(PlotdocSnap.data());
      lastpaymentTime = PlotdocSnap.data().lastPayment;
      const dateLast = new Date(lastpaymentTime.seconds * 1000);
      const dateNow = new Date();

      const timeDifference = dateNow - dateLast;
      const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      // console.log(`The difference in days is ${Math.floor(dayDifference)} days.`);
      if (dayDifference - 65 > 0) {
        if (parseInt(Plot.paidAmount) >= Plot.TotalAmount) {
          // Go Green
        } else {
          setPenalty(1000);
        }
      }
      // setNumberOfPenelties(i);
      // setAmount(penalty*i + Amount)
    }
    if (CatadocSnap.exists()) {
      setcatagory(CatadocSnap.data());
      // installmentAmount = CatadocSnap.data().InstallmentAmount;
      // console.log(CatadocSnap.data());
      // setAmount(installmentAmount);
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
    console.log("Panelty", penalty);
    await setDoc(doc(db, "Transactions", randomNum), {
      fileNumber: pid,
      agentID: aid,
      agentName: agent.Name,
      customerName: customer.Name,
      customerLastName: customer.FName,
      customerID: cid,
      proof: url,
      penalty: penalty,
      payment: Amount,
      total: Amount,
      nature: "installment",
      time: serverTimestamp(),
      InvId: randomNum,
      Category: cata,
      varified: false,
      totalPaidTillNow: parseInt(Plot.paidAmount) + parseInt(Amount),
      totalPlotValue: Plot.TotalAmount,
      numberofInstallmentMonth: NoOfInstallments,
    });
    //     let x=Plot.lastPaymentMonth-11;
    //     let y=Plot.lastPaymentYear+1;
    // if (Plot.lastPaymentMonth>11) {
    //   x=Plot.lastPaymentMonth-11;
    //   y=Plot.lastPaymentYear+1;
    // }
    await updateDoc(doc(db, "Plots", pid), {
      lastPayment: serverTimestamp(),
      // paidAmount:parseInt(Plot.paidAmount) + parseInt(Amount),
      // installmentNo: parseInt(Plot.installmentNo) + 1,
      // lastPaymentMonth:x,
      // lastPaymentYear:y
      invoicePending: true,
    });
    onClose();
  }
  const d = new Date();

  console.log(Plot.lastPaymentMonth, Plot.lastPaymentYear);
  // console.log(Plot? Plot.lastPayment.toDate():"0");
  // const date = new Date(Plot.lastPayment.seconds * 1000 + Plot.lastPayment.nanoseconds / 1000000); // Convert nanoseconds to milliseconds

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
        <div className="modal-field-group">
          <h6>
            Payment Till :
            {Plot.lastPaymentMonth
              ? month[Plot.lastPaymentMonth] + " / " + Plot.lastPaymentYear
              : "Only Works For New Plots"}{" "}
          </h6>
          <h6>
            Last Payment:{" "}
            {Plot.lastPayment
              ? `${Plot.lastPayment.toDate().getDate()} / ${
                  month[Plot.lastPayment.toDate().getMonth()]
                } / ${Plot.lastPayment.toDate().getFullYear()}`
              : "0"}
          </h6>
          <p>Number Of Installments</p>

          <input
            type="number"
            placeholder="Amount"
            value={NoOfInstallments}
            onChange={(e) => {
              if (parseInt(e.target.value) > 0) {
                setNoOfInstallments(parseInt(e.target.value));
                setAmount(Plot.Installment * parseInt(e.target.value));
              }
            }}
          />
        </div>

        <div className="modal-field-group">
          <p>Panelty</p>
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
          <input type="file" onChange={handleChange} accept="/image/*" />
        </div>

        <button
          disabled={DisableButton}
          className="modal-button"
          onClick={handleUpload}
        >
          Submit
        </button>
        <p style={{ textAlign: "center" }}>{percent}% done</p>
      </div>
    </Modal>
  );
}

export default AddTransactions;
