import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import generateRandomNumber from "../../../RandomNumber";
import { template } from "lodash";
import "./clientform.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/header/Header";

const PlotRegistrationForm = () => {
  const [fileNumber, setfileNumber] = useState("");
  const [AgentsList, setAgentsList] = useState([]);
  const [CatagoryList, setCatagoryList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state.Cuid;

  useEffect(() => {
    const generateNumber = async () => {
      const number = await generateRandomNumber("Plots", "DLM");
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
    creationTime: serverTimestamp(),
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
    <>
      <Header />
      <div className="container">
        <h1 className="title" style={{ textAlign: "justify" }}>
          Plot Registration Form
        </h1>
        <div className="content">
          <form action="#" onSubmit={handleSubmit}>
            <div className="user-details" style={{ marginBottom: "10px" }}>
              <div className="input-box">
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
              </div>
              <div className="input-box">
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
              </div>

              <div className="input-box">
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
              </div>
              <div className="input-box">
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

              <div className="input-box">
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
              </div>
              <div className="input-box">
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
              </div>
            </div>
            <div class="gender-details">
              <input type="radio" name="gender" id="dot-1" />
              <input type="radio" name="gender" id="dot-2" />
              <input type="radio" name="gender" id="dot-3" />
              <input type="radio" name="gender" id="dot-4" />
              <label
                class="gender-title"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Category
              </label>
              <div class="category">
                <label for="dot-1">
                  <span class="dot one"></span>
                  <span class="gender">A</span>
                </label>
                <label for="dot-2">
                  <span class="dot two"></span>
                  <span class="gender">B</span>
                </label>
                <label for="dot-3">
                  <span class="dot three"></span>
                  <span class="gender">C</span>
                </label>
                <label for="dot-4">
                  <span class="dot four"></span>
                  <span class="gender">D</span>
                </label>
              </div>
            </div>
            <div className="button">
              <button type="submit" style={{ padding: "10px" }}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PlotRegistrationForm;
