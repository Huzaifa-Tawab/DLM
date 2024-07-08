import React, { useEffect, useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import xIcon from "../../Assets/Xincon.png";
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
    fetchWinners()
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
      containerClassName="custom-modal-container"
      closeOnOuterClick={true}
    >
    <h1>Results</h1>
    <div>
      {winners.map((e)=><>{e} <br /></>)}
    </div>
    </Modal>
  );
}

export default NotificationWinner;
