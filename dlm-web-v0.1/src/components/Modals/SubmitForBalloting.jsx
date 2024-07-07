import React, { useState } from "react";
import Modal from "simple-react-modal";

import { db } from "../../firebase";
import xIcon from "../../Assets/Xincon.png";
import {
  Timestamp,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import Countdown from "react-countdown";

function SubmitForBalloting({
  showModal,
  onClose,
  agentName,
  agentId,
  title,
  end,
  modalId,
}) {
  const [plotText, setPlotText] = useState("");
  const [plotCount, setPlotCount] = useState(0);
  const maxLimit = 9;

  const handlePlotTextChange = (e) => {
    const value = e.target.value;
    setPlotText(value);
    const valuesArray = value.split(',').map(item => item.trim()).filter(item => item);
    setPlotCount(valuesArray.length);
  };

  async function handleUpload() {
    if (plotCount > maxLimit) {
      alert(`You have exceeded the maximum limit of ${maxLimit} plots.`);
      return;
    }

    const BallottingRef = doc(db, "Balloting", modalId);
    const currentTimestamp = Timestamp.fromDate(new Date());

    await updateDoc(BallottingRef, {
      submission: arrayUnion({
        agentId: agentId,
        agentName: agentName,
        plots: plotText,
        timestamp: currentTimestamp,
      })
    }).then(() => {
      onClose();
      alert("Plots submitted successfully.");
    })
  }

  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
      closeOnOuterClick={true}
    >
      <h2>{title}</h2>
      <h2><Countdown date={end.seconds *1000} /></h2>
      
      <span>Once you save the item it can't be edited or deleted</span>
      <div className="closebutton">
        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      <div>
        <div className="modal-field-group">
          <br />
          <p>Plot Numbers (comma-separated)</p>
          <textarea
            value={plotText}
            onChange={handlePlotTextChange}
            placeholder="Enter plot numbers separated by commas"
            rows={5}
            cols={40}
          />
          <div>
            {plotCount}/{maxLimit}
          </div>
          {plotCount > maxLimit && (
            <div style={{ color: 'red' }}>
              You have exceeded the maximum limit!
            </div>
          )}
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
