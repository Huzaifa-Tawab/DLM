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

  const [agentId, setAgentId] = useState("");
  const [agentName, setAgentName] = useState("");
  const [customer, setCustomer] = useState("");
  const navigate = useNavigate();
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
  const [possessionAmountError, setpossessionAmountError] = useState("");
  const [InstallmentMonthError, setInstallmentMonthError] = useState("");

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
      setpossessionAmount(data.PossessionAmount ?? "");
      setPaidAmount(data.paidAmount ?? "");
      setOtherAmount(data.OtherAmount ?? "");
      setOtherAmountTitle(data.OtherAmountTitle ?? "");
      setCreationTime(data.creationTime ?? null);
      setLastPaymentTime(data.lastPayment ?? null);
      console.log(PlotdocSnap.data());
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

    if (Address && Address.trim() === "") {
      setAddressError("Address Can not be empty");
      error++;
    }
    if (Catagory && Catagory.trim() === "") {
      setCatagoryError("Category Can not be empty");
      error++;
    }
    if (CityTown && CityTown.trim() === "") {
      setCityTownError("city/Town Can not be empty");
      error++;
    }
    if (!PaidAmount) {
      setPaidAmountError("PaidAmount Can not be empty");
      error++;
    }
    if (PlotSize && PlotSize.trim() === "") {
      setPlotsizeError("Plot Size Can not be empty");
      error++;
    }
    if (TotalAmount && TotalAmount.trim() === "") {
      setTotalAmountError("Total Amount Can not be empty");
      error++;
    }
    if (possessionAmount && possessionAmount.trim() === "") {
      setpossessionAmountError("Possession Amount Can not be empty");
      error++;
    }
    if (InstallmentMonth && InstallmentMonth.trim() === "") {
      setInstallmentMonthError("Installmment Month Can not be empty");
      error++;
    }
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
    setInstallmentMonthError("");
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

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <div className="container">
        <h1 className="title" style={{ textAlign: "justify" }}>
          Plot Edit Form
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
              {/*  */}
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
                  <p>{PlotSizeError}</p>
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
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Catageory:
                  </label>
                  <select value={Catagory} onChange={handleCategoryChange}>
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
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Society:
                  </label>
                  <select onChange={handleSocietyChange}>
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
                  <label style={{ display: "block", marginBottom: "5px" }}>
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
                  <label style={{ display: "block", marginBottom: "5px" }}>
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
  );
};

export default PlotEditForm;
