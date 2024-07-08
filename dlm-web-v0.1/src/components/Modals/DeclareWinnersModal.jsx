import React, { useState, useEffect } from "react";
import Modal from "simple-react-modal";
import Select from "react-select";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import xIcon from "../../Assets/Xincon.png";

function DeclareWinnersModal({ show, onClose, ballotingId }) {
  const [ballotingData, setBallotingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [plotList, setPlotList] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const ballotingDocRef = doc(db, "Balloting", ballotingId);
        const ballotingDoc = await getDoc(ballotingDocRef);

        if (ballotingDoc.exists()) {
          setBallotingData(ballotingDoc.data());
          const limit = ballotingDoc.data().limit;
          setWinners(new Array(limit).fill("")); // Initialize winners array
        }

        const plotsQuery = query(collection(db, "Plots"),
        //  where("isNowPlot", "==", false)
        );
        const plotsSnapshot = await getDocs(plotsQuery);
        const plots = plotsSnapshot.docs.map((doc) => ({
          id: doc.id,
          FileNumber: doc.data().FileNumber, // Make sure to map the correct data fields
        }));
        setPlotList(plots);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchDataFromFirestore();
  }, [ballotingId]);

  const handleWinnerChange = (index, selectedOption) => {
    const newWinners = [...winners];
    newWinners[index] = selectedOption ? selectedOption.value : "";
    setWinners(newWinners);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ballotingDocRef = doc(db, "Balloting", ballotingId);
      await updateDoc(ballotingDocRef, { 
        winners:winners,
        winnerDeclared:true,

    });
      onClose();
    } catch (error) {
      console.error("Error updating winners:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const options = plotList.map((plot) => ({
    value: plot.FileNumber,
    label: plot.FileNumber,
  }));

  return (
    <Modal show={show} onClose={onClose} closeOnOuterClick={true}>
      <div className="modal-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Declare Winners</h2>
        <img onClick={onClose} src={xIcon} alt="Close" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-body" style={{ flexDirection: "column" }}>
          {winners.map((winner, index) => (
            <div key={index}>
              <label>Select Winner {index + 1}</label>
              <Select
                value={options.find(option => option.value === winner)}
                onChange={(selectedOption) => handleWinnerChange(index, selectedOption)}
                options={options}
                isClearable
                placeholder="Select a plot"
              />
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button type="submit">Declare Winners</button>
        </div>
      </form>
    </Modal>
  );
}

export default DeclareWinnersModal;
