import React, { useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { update } from "lodash";
import { doc, updateDoc } from "firebase/firestore";
import "./modal.css";
import xIcon from "../../Assets/Xincon.png";

function UploadRequestSS({ showModal, onClose, uid }) {
  const [file, setFile] = useState("");
  const [chequeOf, setchequeOf] = useState("");
  const [chequeNo, setchequeNo] = useState("");
  const [Amount, setAmount] = useState("");
  const [percent, setPercent] = useState(0);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const handleUpload = () => {
    if (!file) {
      alert("Please upload an image first!");
    } else if (!Amount.trim === "") {
      alert("Please enter amount");
    } else if (!chequeNo.trim === "") {
      alert("Please enter Cheque Number");
    } else if (!chequeOf.trim === "") {
      alert("Please enter Cheque Of");
    } else {
      uploadToFirebase();
    }
  };
  function uploadToFirebase() {
    const storageRef = ref(storage, `/WithDrawal Proofs/${uid}`);
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
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          UpdateData(url);
        });
      }
    );
  }
  async function UpdateData(url) {
    const Documents = doc(db, "WithDraw", uid);
    await updateDoc(Documents, {
      Proof: url,
      chequeNo: chequeNo,
      chequeOf: chequeOf,
      Amount: Amount,
      status: "Approved",
    }).then((e) => {
      onClose();
      alert("WithDraw Has Been Approved");
    });
  }
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
      closeOnOuterClick={true}
    >
      <h2>WithDrawal Proof</h2>
      <div className="closebutton">
        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      <div>
        <div className="modal-field-group">
          <p>Cheque Of</p>
          <input
            type="text"
            onChange={(e) => {
              setchequeOf(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Cheque Number</p>
          <input
            type="text"
            onChange={(e) => {
              setchequeNo(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Amount</p>
          <input
            type="text"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Choose File</p>
          <input type="file" onChange={handleChange} accept="/image/*" />
        </div>
        <button className="modal-button" onClick={handleUpload}>
          Upload
        </button>
        <p style={{ textAlign: "center" }}>{percent}% done</p>
      </div>
    </Modal>
  );
}

export default UploadRequestSS;
