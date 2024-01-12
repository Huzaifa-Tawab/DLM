import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import generateRandomNumber from "../../../RandomNumber";
import { template } from "lodash";

const PlotRegistrationForm = () => {
  const [fileNumber, setfileNumber] = useState("");
  const [AgentsList, setAgentsList] = useState([]);
  const [CatagoryList, setCatagoryList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state.Cuid;

  useEffect(() => {
    const generateNumber = async () => {
      const number = await generateRandomNumber("Plots");
      setfileNumber(number);
    };
    getCatagories();
    generateNumber();
    getAgents();
  }, []);

  const [formData, setFormData] = useState({
    Address: "",
    AgentId: "",
    Category: "null",
    CityTown: "Islamabad",
    CustomerId: id,
    FileNumber: fileNumber,
    PaidAmount: "",
    PlotSize: "5Marla",
    TotalAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileNumber) {
      // Handle error condition, fileNumber is not available
      return;
    }
    formData["FileNumber"] = fileNumber;

    console.log("Form submitted:", formData);
    await createPlot();
  };

  const createPlot = async () => {
    await setDoc(doc(db, "Plots", fileNumber), formData);
    updateAgent();
    navigate(`/details/plot/${fileNumber}`);
  };
  const updateAgent = async () => {
    await updateDoc(doc(db, "Agent", formData.AgentId), {
      Plots: arrayUnion(fileNumber),
    });
  };
  async function getAgents() {
    const querySnapshot = await getDocs(collection(db, "Agent"));
    const agents = [];
    querySnapshot.forEach((doc) => {
      let temp = { id: doc.id, name: doc.data()["Name"] };
      agents.push(temp);
    });
    setAgentsList(agents);
  }
  async function getCatagories() {
    const querySnapshot = await getDocs(collection(db, "PlotCategories"));
    const cat = [];
    querySnapshot.forEach((doc) => {
      let temp = { id: doc.id, name: doc.data() };
      cat.push(temp);
    });
    setCatagoryList(cat);
  }
  console.log(CatagoryList);
  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Plot Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Address:
          </label>
          <input
            type="text"
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Agent ID:
          </label>
          <select
            name="AgentId"
            value={formData.AgentId}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="" disabled>
              Select Agent
            </option>
            {AgentsList.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Category:
          </label>
          <input
            type="text"
            name="Category"
            value={formData.Category}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            City/Town:
          </label>
          <input
            type="text"
            name="CityTown"
            value={formData.CityTown}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            File Number:
          </label>
          <input
            disabled
            type="text"
            name="FileNumber"
            value={fileNumber}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Paid Amount:
          </label>
          <input
            type="text"
            name="PaidAmount"
            value={formData.PaidAmount}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Plot Size:
          </label>
          <input
            type="text"
            name="PlotSize"
            value={formData.PlotSize}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Total Amount:
          </label>
          <input
            type="text"
            name="TotalAmount"
            value={formData.TotalAmount}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <button type="submit" style={{ padding: "10px" }}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlotRegistrationForm;
