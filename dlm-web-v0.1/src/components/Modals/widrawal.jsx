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
import { Loader } from "rsuite";

function Widrawal({ showModal, onClose, uid, totalCredit, name }) {
  const [Amount, setAmount] = useState(0);
  const [Error, setError] = useState("");
  const [isloading, setisloading] = useState(false);

  function handleUpload() {
    let error = false;
    setError("");
    if (parseInt(Amount) <= 0) {
      // error = true;
      // setError("Amount Can Not be less then 100,000 ");
    } else if (parseInt(Amount) >= parseInt(totalCredit)) {
      error = true;

      setError("Amount Can Not Exceed " + totalCredit);
    }
    console.log(error);
    if (!error) {
      setisloading(true);
      UpdateData();
    }
  }

  async function UpdateData() {
    try {
      await addDoc(collection(db, "WithDraw"), {
        amount: Amount,
        status: "Pending",
        created: serverTimestamp(),
        agentid: uid,
      }).then(async (e) => {
        // Set the "capital" field of the city 'DC'
        await updateDoc(doc(db, "Agents", uid), {
          credit: totalCredit - Amount,
        });
      });
      onClose();
      setisloading(false);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
    >
      {isloading ? (
        <Loader />
      ) : (
        <>
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
        </>
      )}
    </Modal>
  );
}

export default Widrawal;
