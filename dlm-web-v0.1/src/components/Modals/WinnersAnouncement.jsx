
import React, { useState, useEffect } from 'react';
import Modal from 'simple-react-modal';

import { db } from '../../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

const WinnersAnouncement = ({ isOpen, onClose, ballotingId }) => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    fetchWinners()
  }, [ballotingId]);
  const fetchWinners = async () => {
    const ballotingDocRef = doc(db, "Balloting", ballotingId);
    const ballotingDoc = await getDoc(ballotingDocRef);
    if (ballotingDoc.exists()) {
      const data = ballotingDoc.data();
      setWinners(data.winners || []);
    }
  };
  return (
    <Modal open={isOpen} onClose={onClose}>
      <h2>Winners</h2>
      <ul>
        {winners.map((winner, index) => (
          <li key={index}>{winner}</li>
        ))}
      </ul>
    </Modal>
  );
};

export default WinnersAnouncement;
