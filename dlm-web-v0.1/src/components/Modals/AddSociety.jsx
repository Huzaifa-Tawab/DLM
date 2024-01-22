import React, { useState } from "react";
import Modal from "simple-react-modal";

import { db, storage } from "../../firebase";
import xIcon from "../../assets/Xincon.png";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { parseInt } from "lodash";

function AddSociety({ showModal, onClose }) {
  const name = localStorage.getItem("Name");
  const id = localStorage.getItem("id");

  const [Expense, setExpense] = useState();
  const [Desc, setDesc] = useState("");
  const [Title, setTitle] = useState("");
  const [Error, setError] = useState("");

  function handleUpload() {
    let error = false;
    setError("");
    // if (parseInt(Expense) < 0) {
    //   console.log(parseInt(Expense) < 0);
    //   error = true;
    //   setError("Amount Can Not Be Negitive");
    // }
    if (Title === "") {
      error = true;

      setError("Title Can Not Be Empty");
    }
    // if (Desc.trim() === "") {
    //   setDesc("none");
    // }
    console.log(error);
    if (!error) {
      UpdateData();
    }
  }

  async function UpdateData() {
    try {
      await setDoc(doc(db, "Society", Title), {
        name: Title,
        created: serverTimestamp(),
        by: name,
        id: id,
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
      <h2>Society</h2>
      <span>Once you save the item it can't be edit or delete</span>
      <div className="closebutton">
        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      {/* <div className="Modal-row"> */}

      {/* </div> */}
      <div>
        <div className="modal-field-group">
          <br />
          <p>Title</p>
          <input
            type="text"
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        {/* <div className="modal-field-group">
          <p>Amount</p>
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => {
              setExpense(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Details</p>
          <textarea
            type="text"
            placeholder="Enter Details"
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          /> */}
        {/* </div> */}
        <p>{Error}</p>
        <br />
        <button className="modal-button" onClick={handleUpload}>
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default AddSociety;
