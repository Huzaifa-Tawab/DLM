import React, { useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import xIcon from "../../Assets/Xincon.png";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { parseInt } from "lodash";

function AddPromo({ showModal, onClose }) {
  const name = localStorage.getItem("Name");
  const id = localStorage.getItem("id");

  const [Target, setTarget] = useState();
  const [date, setDate] = useState("");
  const [Title, setTitle] = useState("");
  const [Prize, setPrize] = useState("");
  const [Error, setError] = useState("");

  function handleUpload() {
    let error = false;
    setError("");
    if (parseInt(Target) < 0) {
      console.log(parseInt(Target) < 0);
      error = true;
      setError("Target Can Not Be Negitive");
    }
    if (Title === "") {
      error = true;

      setError("Title Can Not Be Empty");
    }
    if (date.trim() === "") {
      setError("Date Can Not Be Empty");

      error = true;
    }
    if (Prize.trim() === "") {
      setError("Prize Can Not Be Empty");

      error = true;
    }
    console.log(error);
    if (!error) {
      UpdateData();
    }
  }

  async function UpdateData() {
    try {
      const timestamp = Timestamp.fromDate(new Date(date));
      await addDoc(collection(db, "Promos"), {
        title: Title,
        target: Target,
        endsAt: timestamp,
        createdAt: serverTimestamp(),
        prize: Prize,
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
        <h2>Promo</h2>
        <span>Once you save the item it can't be edit or delete</span>
      </div>
      <div>
        <div className="modal-field-group">
          <p>Title</p>
          <input
            type="text"
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Target</p>
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => {
              setTarget(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Ends At</p>
          <input
            type="date"
            placeholder="DD/YY/MM"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Prize</p>
          <input
            type="text"
            placeholder="1 Marla ,Car,Bike"
            onChange={(e) => {
              setPrize(e.target.value);
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

export default AddPromo;
