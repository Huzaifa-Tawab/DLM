import React, { useState } from "react";
import Modal from "simple-react-modal";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import xIcon from "../../Assets/Xincon.png";

function AddPlotListing({ show, onClose, onAddPlot, user }) {
  const plotNames = user.Plots;
  const [plotNumber, setPlotNumber] = useState(plotNames[0]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(
        collection(db, "PlotListings"),
        where("PlotNumber", "==", plotNumber),
        where("AgentId", "==", user.Cnic)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("A listing for this plot already exists.");
        return;
      }

      const newPlot = {
        PlotNumber: plotNumber,
        Category: category,
        price: parseInt(price),
        desc: description,
        isSold: false,
        createdAt: Timestamp.now(),
        AgentId: user.Cnic,
      };

      await addDoc(collection(db, "PlotListings"), newPlot);
      onAddPlot();
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("An error occurred while adding the plot.");
    }
  };

  return (
    <Modal show={show} onClose={onClose} closeOnOuterClick={true}>
      <div className="modal-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Add New Plot</h2>
        <img onClick={onClose} src={xIcon} alt="Close" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="modal-body" style={{ flexDirection: "column" }}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <label>Plot Number/File Number</label>
          <select value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)}>
            {plotNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>

          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />

          <label>Price (PKR)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="modal-footer">
          <button type="submit">Add Plot</button>
        </div>
      </form>
    </Modal>
  );
}

export default AddPlotListing;
