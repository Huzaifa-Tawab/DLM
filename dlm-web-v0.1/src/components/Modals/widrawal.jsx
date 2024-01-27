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
  updateDoc,
} from "firebase/firestore";
import { parseInt } from "lodash";

function Widrawal({ showModal, onClose }) {
  const name = localStorage.getItem("Name");
  const id = localStorage.getItem("id");

  const [Expense, setExpense] = useState();
  const [Desc, setDesc] = useState("");
  const [Amount, setAmount] = useState("");
  const [Error, setError] = useState("");

  function handleUpload() {
    let error = false;
    setError("");
    if (Title === "") {
      error = true;

      setError("Title Can Not Be Empty");
    }
    console.log(error);
    if (!error) {
      UpdateData();
    }
  }

  async function UpdateData() {
    try {
      await setDoc(doc(db, "WidhrawalRequset", Amount), {
        name: Amount,

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
      <h2>Widrawal Amount</h2>
      <span>Minimum Widhrawal Amount is 100000</span>
      <div className="closebutton">
        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      <div>
        <div className="modal-field-group">
          <br />
          <p>Amount</p>
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
        <p>{Error}</p>
        <br />
        <button className="modal-button" onClick={handleUpload}>
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default Widrawal;
