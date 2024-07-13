import React, { useEffect, useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import xIcon from "../../Assets/Xincon.png";
import "./ballotingnotify.css";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import isAdmin from "../../../IsAdmin";

function NotificationWinner({ showModal, onClose, bid }) {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    fetchWinners();
  }, [bid]);
  const fetchWinners = async () => {
    const ballotingDocRef = doc(db, "Balloting", bid);
    const ballotingDoc = await getDoc(ballotingDocRef);
    if (ballotingDoc.exists()) {
      const data = ballotingDoc.data();
      setWinners(data.winners || []);
    }
  };
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="ballot-modal-custom-modal-container"
      closeOnOuterClick={true}
    >
      <div className="notify-winer-head">
        <h2 className="result">Results</h2>

        <img onClick={onClose} src={xIcon} alt="" />
      </div>
      <div className="balot-notfy-results">
        {winners.map((e) => (
          <>
            {e} <br />
          </>
        ))}
      </div>
    </Modal>
  );
}

export default NotificationWinner;
