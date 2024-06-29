import React, { useState } from "react";
import Modal from "simple-react-modal";

import { db, storage } from "../../firebase";
import xIcon from "../../Assets/Xincon.png";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

function AddArchive({ showModal, onClose, pid }) {
  const [Error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);

  function handleUpload() {
    let error = false;
    setError("");

    if (file === null) {
      error = true;

      setError("File Can Not Be Empty");
    }

    if (invoiceId === null || invoiceId === "") {
      error = true;

      setError("You must enter name or invoice id");
    }

    if (!error) {
      UpdateData();
    }
  }

  async function UpdateData() {
    try {
      await addDoc(collection(db, "PlotAssets"), {
        img: file,
        pid: pid,
        dateTime: Timestamp.fromDate(new Date(selectedDateTime)),
        invId: invoiceId,
      });
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setFile(base64);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onDateSelect = (e) => {
    setSelectedDateTime(e.target.value);
  };

  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
      closeOnOuterClick={false}
    >
      <h2>Add Archieve</h2>
      <div className="closebutton">
        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      <div>
        <div className="modal-field-group">
          <p>Name or Invoice Id</p>
          <input
            type="text"
            placeholder="Name or InvoiceId"
            onChange={(e) => {
              setInvoiceId(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <br />
          <p>Select date</p>
          <input
            className="calender"
            type="datetime-local"
            name="Select date"
            onChange={onDateSelect}
          />
        </div>
        <div className="modal-field-group">
          <br />
          <p>Upload file</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            // style={{
            //   position: "absolute",
            //   top: 0,
            //   left: 0,
            //   width: "100%",
            //   height: "100%",
            //   opacity: 0,
            //   cursor: "pointer",
            //   zIndex: -1,
            // }}
          />
        </div>

        {Error && <p style={{ color: "red" }}>*{Error}</p>}
        <br />
        <button className="modal-button" onClick={handleUpload}>
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default AddArchive;
