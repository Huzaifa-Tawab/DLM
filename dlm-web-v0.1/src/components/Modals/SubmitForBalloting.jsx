import React, { useState } from "react";
import Modal from "simple-react-modal";

import { db, storage } from "../../firebase";
import xIcon from "../../Assets/Xincon.png";
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { parseInt } from "lodash";

function SubmitForBalloting({
  showModal,
  onClose,
  agentName,
  agentId,
  title,
  modalId,
}) {
  const [PlotId, setPlotId] = useState("");

  async function handleUpload() {
    const BalottiongRef = doc(db, "Balloting", modalId);
    const currentTimestamp = Timestamp.fromDate(new Date());

    // Atomically add a new region to the "regions" array field.
    await updateDoc(BalottiongRef, {
      submission: arrayUnion({
        agentId: agentId,
        agentName: agentName,
        plot: PlotId,
        timestamp: currentTimestamp,
      }),
    });
  }

  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
      closeOnOuterClick={true}
    >
      <h2>{title}</h2>
      <span>Once you save the item it can't be edit or delete</span>
      <div className="closebutton">
        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      <div>
        <div className="modal-field-group">
          <br />
          <p>Plot Number</p>
          <input
            type="text"
            onChange={(e) => {
              setPlotId(e.target.value);
            }}
          />
        </div>

        <br />
        <button className="modal-button" onClick={handleUpload}>
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default SubmitForBalloting;
