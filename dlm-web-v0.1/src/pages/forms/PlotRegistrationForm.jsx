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
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const handleOptionChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedOptionIndex(
      selectedIndex !== "" ? parseInt(selectedIndex, 10) : null
    );
  };
  useEffect(() => {
    const generateNumber = async () => {
      const number = await generateRandomNumber("Plots", "DLM");
      setfileNumber(number);
    };
    getCatagories();
    generateNumber();
    getAgents();
  }, []);
  const userid = localStorage.getItem("id");
  const name = localStorage.getItem("Name");
  const [formData, setFormData] = useState({
    Address: "",
    AgentId: userid,
    AgentName: name,
    Category: "null",
    CityTown: "",
    CustocmerId: id,
    FileNumber: fileNumber,
    PaidAmount: "",
    PlotSize: "5Marla",
    TotalAmount: "",
    creationTime: serverTimestamp(),
  });
  const [Address, setAdress] = useState("");
  const [AgentId, setAgentId] = useState("");
  const [AgentName, setAgentName] = useState("");
  const [Category, setCategory] = useState("");
  const [CityTown, setCityTown] = useState("");
  const [CustocmerId, setCustomerId] = useState("");
  const [FileNumber, setFileNumber] = useState("");
  const [PaidAmount, setPaidAmount] = useState("");
  const [PlotSize, setPlotsize] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    formData["FileNumber"] = fileNumber;

    console.log("Form submitted:", formData);
    await createPlot();
  };

  const createPlot = async () => {
    await setDoc(doc(db, "Plots", fileNumber), formData);
    updateAgent();
    updateCust();
    navigate(`/details/plot/${fileNumber}`);
  };
  const updateAgent = async () => {
    await updateDoc(doc(db, "Agent", formData.AgentId), {
      Plots: arrayUnion(fileNumber),
    });
  };
  const updateCust = async () => {
    await updateDoc(doc(db, "Customers", id), {
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
      cat.push(doc.data());
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
                    value={PlotSize}
                    onChange={(e) => {
                      setPlotsize(e.target.value);
                    }}
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
                    Plot Size:
                  </label>
                  <select
                    value={
                      selectedOptionIndex !== null ? selectedOptionIndex : ""
                    }
                    onChange={handleOptionChange}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {CatagoryList.map((option, index) => (
                      <option key={index} value={index}>
                        {option.name}
                      </option>
                    ))}
                  </select>
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
                    value={CityTown}
                    onChange={(e) => {
                      setCityTown(e.target.value);
                    }}
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
                Adjustment
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
