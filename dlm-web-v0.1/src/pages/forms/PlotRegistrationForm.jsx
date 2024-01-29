import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import generateRandomNumber from "../../../RandomNumber";

import "./clientform.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/header/Header";
import Loader from "../../components/loader/Loader";
import SideBar from "../../components/Sidebar/sidebar";
const PlotRegistrationForm = () => {
  const [fileNumber, setfileNumber] = useState("");
  const [AgentsList, setAgentsList] = useState([]);
  const [CatagoryList, setCatagoryList] = useState([]);
  const [SocietyList, setSocietyList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state.Cuid;
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const userid = localStorage.getItem("id");
  const name = localStorage.getItem("Name");
  const [isLoading, setisLoading] = useState(true);
  const [Address, setAdress] = useState("");
  const [Catagory, setCatagory] = useState("");
  const [Society, setSociety] = useState("");
  const [CityTown, setCityTown] = useState("");
  const [PaidAmount, setPaidAmount] = useState("");
  const [PlotSize, setPlotsize] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");
  const [possessionAmount, setpossessionAmount] = useState("");
  const [InstallmentMonth, setInstallmentMonth] = useState("");
  const [OtherAmountTitle, setOtherAmountTitle] = useState("None");
  const [OtherAmount, setOtherAmount] = useState("0");
  const [AddressError, setAddressError] = useState("");
  const [CatagoryError, setCatagoryError] = useState("");
  const [CityTownError, setCityTownError] = useState("");
  const [PaidAmountError, setPaidAmountError] = useState("");
  const [PlotSizeError, setPlotsizeError] = useState("");
  const [TotalAmountError, setTotalAmountError] = useState("");
  const [BlockError, setBlockError] = useState("");
  const [possessionAmountError, setpossessionAmountError] = useState("");
  const [InstallmentMonthError, setInstallmentMonthError] = useState("");
  const [Block, setBlock] = useState("");
  const [labelError, setlabelError] = useState("");

  const [Selectedsize, setSelectedsize] = useState("");

  useEffect(() => {
    const generateNumber = async () => {
      const number = await generateRandomNumber("Plots", "DLM");
      setfileNumber(number);
    };
    getCatagories();
    generateNumber();
    getAgents();
    getSocieties();
    setisLoading(false);
  }, []);

  const handleOptionChange = (event) => {
    const selectedIndex = event.target.value;
    setSelectedOptionIndex(
      selectedIndex !== "" ? parseInt(selectedIndex, 10) : null
    );
    setCatagory(CatagoryList[selectedIndex].name);
    // setpossessionAmount(CatagoryList[selectedIndex].PossessionAmount);
    // setInstallmentMonth(CatagoryList[selectedIndex].InstallmentAmount);
    // setPaidAmount(CatagoryList[selectedIndex].DownPayment);
    // setTotalAmount(CatagoryList[selectedIndex].TotalAmount);
    // console.log(CatagoryList[selectedIndex].name);
  };
  const handlesizechange = (e) => {
    const Selectedsize = e.target.value;
    setSelectedsize(e.target.value);
    console.log(Selectedsize);
  };
  // const handleSocietyChange = (event) => {
  //   const selectedIndex = event.target.value;
  //   setSelectedOptionIndex(
  //     selectedIndex !== "" ? parseInt(selectedIndex, 10) : null
  //   );
  //   setSociety(SocietyList[selectedIndex].name);
  // setpossessionAmount(CatagoryList[selectedIndex].PossessionAmount);
  // setInstallmentMonth(CatagoryList[selectedIndex].InstallmentAmount);
  // setPaidAmount(CatagoryList[selectedIndex].DownPayment);
  // setTotalAmount(CatagoryList[selectedIndex].TotalAmount);
  // console.log(CatagoryList[selectedIndex].name);
  // };
  const handleSubmit = async (e) => {
    setisLoading(true);
    e.preventDefault();
    resetWarings();
    let error = 0;

    if (Address.trim() === "") {
      console.log(10);
      setAddressError("Address Can not be empty");
      error++;
    }
    if (Catagory.trim() === "") {
      setCatagoryError("Category Can not be empty");
      error++;
      console.log(9);
    }
    if (CityTown.trim() === "") {
      setCityTownError("city/Town Can not be empty");

      console.log(8);
      error++;
    }
    if (PaidAmount.trim() === "") {
      console.log(7);

      setPaidAmountError("PaidAmount Can not be empty");
      error++;
    }

    if (PlotSize.trim() === "") {
      console.log(6);
      setPlotsizeError("Plot Size Can not be empty");
      error++;
    }
    if (TotalAmount.trim() === "") {
      console.log(5);
      setTotalAmountError("Total Amount Can not be empty");
      error++;
    }
    if (possessionAmount.trim() === "") {
      console.log(4);
      setpossessionAmountError("Possession Amount Can not be empty");
      error++;
    }

    if (Block.trim() === "") {
      console.log(2);
      setBlockError("Select your block");
      error++;
    }
    if (Selectedsize.trim() === "") {
      console.log(1);
      setlabelError("Select your Option");
      error++;
    }
    console.log(error);
    if (error == 0) {
      await createPlot();
    } else {
      setisLoading(false);
    }
  };
  function resetWarings() {
    setAddressError("");
    setCatagoryError("");
    setCityTownError("");
    setPaidAmountError("");
    setTotalAmountError("");
    setPlotsizeError("");
    setpossessionAmountError("");
    setInstallmentMonthError("");
  }
  const createPlot = async () => {
    const docRef = doc(db, "Customers", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());

      await setDoc(doc(db, "Plots", fileNumber), {
        Address: Address,
        AgentId: userid,
        AgentName: name,
        CustomerName: docSnap.data().Name,
        Category: Catagory,
        CityTown: CityTown,
        CustomerId: id,
        FileNumber: fileNumber,
        paidAmount: PaidAmount,
        Unit: Selectedsize,
        PlotSize: PlotSize,
        TotalAmount: TotalAmount,
        Block: Block,
        PossessionAmount: possessionAmount,
        OtherAmount: OtherAmount,
        OtherAmountTitle: OtherAmountTitle,
        Society: Society,
        verified: false,
        creationTime: serverTimestamp(),
        lastPayment: serverTimestamp(),
      });
      await updateAgent();
      await updateCustomer();
      await updateTransaction();

      navigate(`/details/plot/${fileNumber}`);
    }
  };
  async function updateTransaction() {
    let randomNum = 0;
    let TSize = 1;
    let penalty = 0;
    let customer = {};
    let agent = {};

    const CustomerdocSnap = await getDoc(doc(db, "Customers", id));
    if (CustomerdocSnap.exists()) {
      customer = CustomerdocSnap.data();
    }

    const agentdocSnap = await getDoc(doc(db, "Agent", userid));
    if (agentdocSnap.exists()) {
      agent = agentdocSnap.data();
      console.log(agent);
    }
    while (!TSize == 0) {
      randomNum = `INV-${
        agent.InvId + (Math.floor(Math.random() * 1000000) + 1)
      }`;
      console.log(randomNum);
      const querySnapshotT = await getDocs(
        query(collection(db, "Transactions"), where("id", "==", randomNum))
      );
      console.log(randomNum);

      TSize = querySnapshotT.size;
    }
    console.log(randomNum);
    await setDoc(doc(db, "Transactions", randomNum), {
      fileNumber: fileNumber,
      agentID: userid,
      agentName: name,
      customerName: customer.Name,
      customerLastName: customer.FName,
      customerID: id,
      proof: "",
      penalty: 0,
      payment: PaidAmount,
      total: PaidAmount,
      nature: "downpayment",
      time: serverTimestamp(),
      InvId: randomNum,
      Category: Catagory,
      varified: false,
    });
  }
  const updateAgent = async () => {
    // console.log(formData.AgentId);
    await updateDoc(doc(db, "Agent", userid), {
      Plots: arrayUnion(fileNumber),
    });
  };
  const updateCustomer = async () => {
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
  async function getSocieties() {
    const querySnapshot = await getDocs(collection(db, "Society"));
    const cat = [];
    querySnapshot.forEach((doc) => {
      cat.push(doc.data());
    });
    setSocietyList(cat);
  }

  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="container">
              <h1 className="title" style={{ textAlign: "justify" }}>
                Plot Registration Form
              </h1>
              <div className="content">
                <form action="#" onSubmit={handleSubmit}>
                  <div
                    className="user-details"
                    style={{ marginBottom: "10px" }}
                  >
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
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
                    {/*  */}
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          className="marla-labal"
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Plot Size In
                          <select
                            className="marla"
                            name=""
                            id=""
                            onChange={handlesizechange}
                          >
                            <option value=""></option>
                            <option value="Marla">Marla</option>
                            <option value="Sq ft">Sq ft</option>
                          </select>
                          :<p>{labelError}</p>
                        </label>
                        <input
                          type="number"
                          name="PlotSize In Marla"
                          value={PlotSize}
                          onChange={(e) => {
                            if (e.target.value > 0) {
                              setPlotsize(e.target.value);
                            }
                          }}
                          style={{ width: "100%", padding: "8px" }}
                        />
                        <p>{PlotSizeError}</p>
                      </div>
                    </div>
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
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
                        <p>{CityTownError}</p>
                      </div>
                    </div>
                    <div className="input-box">
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Address:
                      </label>
                      <input
                        type="text"
                        name="Address"
                        value={Address}
                        onChange={(e) => {
                          setAdress(e.target.value);
                        }}
                        style={{ width: "100%", padding: "8px" }}
                      />
                      <p>{AddressError}</p>
                    </div>
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Catageory:
                        </label>
                        <select
                          value={
                            selectedOptionIndex !== null
                              ? selectedOptionIndex
                              : ""
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
                        <p>{CatagoryError}</p>
                      </div>
                    </div>

                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Society:
                        </label>
                        <select
                          onChange={(e) => {
                            setSociety(e.target.value);
                          }}
                        >
                          <option value="" disabled>
                            Select a Society
                          </option>
                          {SocietyList.map((option, index) => (
                            <option key={index} value={option.name}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                        <p>{CatagoryError}</p>
                      </div>
                    </div>

                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Block:
                        </label>
                        <select
                          onChange={(e) => {
                            setBlock(e.target.value);
                          }}
                        >
                          <option value="">Select block</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                        </select>
                        <p>{BlockError}</p>
                      </div>
                    </div>

                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Plot Value:
                        </label>
                        <input
                          type="number"
                          name="TotalAmount"
                          value={TotalAmount}
                          onChange={(e) => {
                            if (parseInt(e.target.value) < 0) {
                              setTotalAmount(0);
                            } else {
                              setTotalAmount(e.target.value);
                            }
                          }}
                          style={{ width: "100%", padding: "8px" }}
                        />
                        <p>{TotalAmountError}</p>
                      </div>
                    </div>
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Down Payment:
                        </label>
                        <input
                          type="number"
                          name="PaidAmount"
                          value={PaidAmount}
                          onChange={(e) => {
                            if (parseInt(e.target.value) < 0) {
                              setPaidAmount(0);
                            } else {
                              setPaidAmount(e.target.value);
                            }
                          }}
                          style={{ width: "100%", padding: "8px" }}
                        />
                        <p>{PaidAmountError}</p>
                      </div>
                    </div>
                    <div className="input-box">
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Possession Amount:
                      </label>
                      <input
                        type="number"
                        name="PossessionAmount"
                        value={possessionAmount}
                        onChange={(e) => {
                          if (parseInt(e.target.value) < 0) {
                            setpossessionAmount(0);
                          } else {
                            setpossessionAmount(e.target.value);
                          }
                        }}
                        style={{ width: "100%", padding: "8px" }}
                      />
                      <p>{possessionAmountError}</p>
                    </div>
                    {/* <div className="input-box">
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Installment/Month:
                </label>
                <input
                  type="number"
                  name="InstallmentMonth"
                  value={InstallmentMonth}
                  onChange={(e) => {
                    if (parseInt(e.target.value) < 0) {
                      setInstallmentMonth(0);
                    } else {
                      setInstallmentMonth(e.target.value);
                    }
                  }}
                  style={{ width: "100%", padding: "8px" }}
                />
                <p>{InstallmentMonthError}</p>
              </div> */}
                    <div className="input-box">
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Other Amount Title:
                      </label>
                      <input
                        type="text"
                        name="OtherAmountTitle"
                        value={OtherAmountTitle}
                        onChange={(e) => {
                          setOtherAmountTitle(e.target.value);
                        }}
                        style={{ width: "100%", padding: "8px" }}
                      />
                    </div>
                    <div className="input-box">
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Amount:
                      </label>
                      <input
                        type="number"
                        name="OtherAmount"
                        value={OtherAmount}
                        onChange={(e) => {
                          if (parseInt(e.target.value) < 0) {
                            setOtherAmount(0);
                          } else {
                            setOtherAmount(e.target.value);
                          }
                        }}
                        style={{ width: "100%", padding: "8px" }}
                      />
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
          </>
        )
      }
    />
  );
};

export default PlotRegistrationForm;
