import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import generateRandomNumber from "../../../RandomNumber";

import "./clientform.css";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/header/Header";
import Loader from "../../components/loader/Loader";
import SideBar from "../../components/Sidebar/sidebar";

const PlotEditForm = () => {
  const [fileNumber, setfileNumber] = useState("");
  const [CatagoryList, setCatagoryList] = useState([]);
  const [SocietyList, setSocietyList] = useState([]);

  const params = useParams();
  // const id = location.state.Cuid;
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [Address, setAdress] = useState("");
  const [CreationTime, setCreationTime] = useState(null);
  const [LastPaymentTime, setLastPaymentTime] = useState(null);
  const [labelError, setlabelError] = useState("");

  const [agentId, setAgentId] = useState("");
  const [agentName, setAgentName] = useState("");
  const [customer, setCustomer] = useState("");
  const navigate = useNavigate();
  const [Catagory, setCatagory] = useState("");
  const [Society, setSociety] = useState("");
  const [CityTown, setCityTown] = useState("");
  const [PaidAmount, setPaidAmount] = useState("");
  const [PlotSize, setPlotsize] = useState("");
  const [PlotUnit, setPlotUnit] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");
  const [possessionAmount, setpossessionAmount] = useState("");
  const [OtherAmountTitle, setOtherAmountTitle] = useState("None");
  const [OtherAmount, setOtherAmount] = useState("0");
  const [AddressError, setAddressError] = useState("");
  const [CatagoryError, setCatagoryError] = useState("");
  const [CityTownError, setCityTownError] = useState("");
  const [PaidAmountError, setPaidAmountError] = useState("");
  const [PlotSizeError, setPlotsizeError] = useState("");
  const [TotalAmountError, setTotalAmountError] = useState("");
  const [possessionAmountError, setpossessionAmountError] = useState("");
  const [Block, setBlock] = useState("");
  const [BlockError, setBlockError] = useState("");
  const [verified, setVerified] = useState("");

  useEffect(() => {
    setfileNumber(params.id);
    getPlotData();

    setisLoading(false);
  }, [params]);

  async function getPlotData() {
    const PlotdocSnap = await getDoc(doc(db, "Plots", params.id));
    if (PlotdocSnap.exists()) {
      let data = PlotdocSnap.data();
      setAdress(data.Address ?? "");
      setCustomer(data.CustomerId);
      setAgentId(data.AgentId);
      setAgentName(data.AgentName);
      setTotalAmount(data.TotalAmount ?? "");
      setCatagory(data.Category ?? "");
      setSociety(data.Society ?? "");
      setCityTown(data.CityTown ?? "");
      setPlotsize(data.PlotSize ?? "");
      setPlotUnit(data.Unit ?? "");
      setpossessionAmount(data.PossessionAmount ?? "");
      setPaidAmount(data.paidAmount ?? "");
      setOtherAmount(data.OtherAmount ?? "");
      setOtherAmountTitle(data.OtherAmountTitle ?? "");
      setCreationTime(data.creationTime ?? null);
      setLastPaymentTime(data.lastPayment ?? null);
      setBlock(data.Block ?? "");
      setVerified(data.verified ?? false);
    }
    await getSocieties();
    await getCatagories();
  }

  const handleCategoryChange = (event) => {
    setCatagory(event.target.value);
  };
  const handleSocietyChange = (event) => {
    setSociety(event.target.value);
  };
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
    if (PlotUnit === "") {
      setlabelError("Select your Option");
      error++;
    }
    console.log(error);
    if (error == 0) {
      await editPlot();
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
  }
  const editPlot = async () => {
    await setDoc(doc(db, "Plots", fileNumber), {
      Address: Address,
      AgentId: agentId,
      AgentName: agentName,
      Category: Catagory,
      CityTown: CityTown,
      CustomerId: customer,
      FileNumber: fileNumber,
      paidAmount: PaidAmount,
      PlotSize: PlotSize,
      TotalAmount: TotalAmount,
      PossessionAmount: possessionAmount,
      installmentNo: 1,
      Unit: PlotUnit,
      verified: verified,
      Block: Block,
      OtherAmount: OtherAmount,
      OtherAmountTitle: OtherAmountTitle,
      Society: Society,
      creationTime: CreationTime,
      lastPayment: LastPaymentTime,
    });

    navigate(`/details/plot/${fileNumber}`);
  };

  async function getCatagories() {
    const querySnapshot = await getDocs(collection(db, "PlotCategories"));
    const cat = [];
    querySnapshot.forEach((doc) => {
      cat.push(doc.data().name);
    });
    setCatagoryList(cat);
  }
  async function getSocieties() {
    const querySnapshot = await getDocs(collection(db, "Society"));
    const cat = [];
    querySnapshot.forEach((doc) => {
      cat.push(doc.data().name);
    });
    setSocietyList(cat);
  }

  const handlesizechange = (e) => {
    setPlotUnit(e.target.value);
  };

  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="container">
              <h1 className="title-form" style={{ textAlign: "justify" }}>
                Plot Edit Form
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
                            value={PlotUnit}
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
                          value={Catagory}
                          onChange={handleCategoryChange}
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {CatagoryList.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
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
                        <select value={Society} onChange={handleSocietyChange}>
                          <option value="" disabled>
                            Select a Society
                          </option>
                          {SocietyList.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
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
                          value={Block}
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
            <Footer />
          </>
        )
      }
    />
  );
};

export default PlotEditForm;
