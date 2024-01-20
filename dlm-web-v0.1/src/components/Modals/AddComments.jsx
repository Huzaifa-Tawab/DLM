import React, { useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import xIcon from "../../assets/Xincon.png";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { parseInt } from "lodash";
import isAdmin from "../../../IsAdmin";

function AddComments({ showModal, onClose, plotid }) {
  console.log(plotid);
  const name = localStorage.getItem("Name");
  const id = localStorage.getItem("id");

  const [Desc, setDesc] = useState("");
  const [Error, setError] = useState("");
  function handleUpload() {
    let error = false;
    setError("");

    if (Desc.trim() === "") {
      setError("Comment Can Not Be empty");
      error = true;
    }
    console.log(error);
    if (!error) {
      UpdateData();
    }
  }

  async function UpdateData() {
    try {
      await addDoc(collection(db, "Comments"), {
        comment: Desc,
        pid: plotid,
        created: serverTimestamp(),
        by: name,
        id: id,
        userType: isAdmin() ? "Admin" : "Agent",
      });
      onClose();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
      closeOnOuterClick={true}
    >
      <div className="closebutton">
        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      <div className="Modal-row">
        <h2>Comments</h2>
        <span>You Can Write Your Remarks Or Comment From Here</span>
      </div>
      <div>
        <div className="modal-field-group">
          <p>Details</p>
          <textarea
            type="text"
            placeholder="Enter Details"
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </div>
        <p>{Error}</p>

        <button className="modal-button" onClick={handleUpload}>
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default AddComments;
