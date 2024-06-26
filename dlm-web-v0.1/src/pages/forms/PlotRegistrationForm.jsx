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
  const [PlotSizeList, setPlotSizeList] = useState([]);
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
  const [TotalAmount, setTotalAmount] = useState(0);
  const [possessionAmount, setpossessionAmount] = useState(0);
  const [InstallmentMonth, setInstallmentMonth] = useState(1);
  const [Downpayment, setDownPayment] = useState("");
  const [Installment, setInstallment] = useState("");
  const [BookingAmount, setBookingAmount] = useState("");

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
  const [Block, setBlock] = useState("General");
  const [isFileNumberEditable, setisFileNumberEditable] = useState(false);
  const [labelError, setlabelError] = useState("");
  const [tempFile, setTempFile] = useState("");
  const [NumOfInstallments, setNumOfInstallments] = useState(0);
  const [InstalmentMonths, setInstallmentsMonths] = useState(0);
  const [Selectedsize, setSelectedsize] = useState("");
  const [overideKin, setoverideKin] = useState(false);
  const [kinName, setkinName] = useState("");
  const [kinPhone, setkinPhone] = useState("");
  const [kinRelation, setkinRelation] = useState("");
  const [kinCnic, setkinCnic] = useState("");

  const TextInput = ({ label, name, value, onChange, error }) => (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", marginBottom: "5px" }}>{label}:</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        style={{ width: "100%", padding: "8px" }}
      />
    </div>
  );
  const NumberInput = ({ label, name, value, onChange, error }) => (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", marginBottom: "5px" }}>{label}:</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        style={{ width: "100%", padding: "8px" }}
      />
    </div>
  );
  useEffect(() => {
    const generateNumber = async () => {
      const number = await generateRandomNumber("Plots", "DYN");
      setfileNumber(number);
      setTempFile(number);
    };
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
    // if (PaidAmount.trim() === "") {
    //   console.log(7);

    //   setPaidAmountError("PaidAmount Can not be empty");
    //   error++;
    // }

    if (PlotSize.trim() === "") {
      // console.log(6);
      // setPlotsizeError("Plot Size Can not be empty");
      // error++;
    }
    if (TotalAmount < -1) {
      // console.log(5);
      // setTotalAmountError("Total Amount Can not be empty");
      // error++;
    }
    if (possessionAmount < -1) {
      console.log(4);

      // setpossessionAmountError("Possession Amount Can not be empty");
      // error++;
    }

    if (Block.trim() === "") {
      console.log(2);
      setBlockError("Select your block");
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
    const d = new Date();
    // let year = ;
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());

      if (overideKin) {
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
          PlotSize: PlotSize,
          TotalAmount: TotalAmount,
          Block: Block,
          BookingAmount: BookingAmount,
          Installment: Installment,
          InstallmentMonth: InstallmentMonth,
          PossessionAmount: possessionAmount,
          Downpayment: Downpayment,
          OtherAmount: OtherAmount,
          OtherAmountTitle: OtherAmountTitle,
          Society: Society,
          verified: false,
          creationTime: serverTimestamp(),
          lastPayment: serverTimestamp(),
          lastPaymentYear: d.getFullYear(),
          lastPaymentMonth: d.getMonth(),
          instamentVerified: true,
          extendedKin: {
            name: kinName,
            cnic: kinCnic,
            phone: kinPhone,
            relation: kinRelation,
          },
          kinOverriden: true,
        });
      } else {
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
          PlotSize: PlotSize,
          TotalAmount: TotalAmount,
          Block: Block,
          BookingAmount: BookingAmount,
          Installment: Installment,
          InstallmentMonth: InstallmentMonth,
          PossessionAmount: possessionAmount,
          Downpayment: Downpayment,
          OtherAmount: OtherAmount,
          OtherAmountTitle: OtherAmountTitle,
          Society: Society,
          verified: false,
          creationTime: serverTimestamp(),
          lastPayment: serverTimestamp(),
          lastPaymentYear: d.getFullYear(),
          lastPaymentMonth: d.getMonth(),
          instamentVerified: true,
        });
      }
      await updateAgent();
      await updateCustomer();
      // await updateTransaction();

      navigate(`/details/plot/${fileNumber}`);
      setisLoading(false);
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

    //
    let dataToSend = {
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
      invoicePending: false,
    };

    await setDoc(doc(db, "Transactions", randomNum), dataToSend);
  }
  const updateAgent = async () => {
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

  async function getCatagories(soc) {
    const cat = [];
    SocietyList.forEach((element) => {
      if (element.name === soc) {
        setisFileNumberEditable(element.isFileNumberEditable);

        Object.entries(element.catagories).map(([key, value]) => {
          cat.push(key);
        });
      }
    });
    setCatagoryList(cat);
  }
  async function getPlotSizes(_Psize) {
    const temp = [];
    console.log(_Psize);
    SocietyList.forEach((element) => {
      if (element.name === Society) {
        Object.entries(element.catagories).map(([key, value]) => {
          if (key === _Psize) {
            console.log(value);
            Object.entries(value).map(([plotsizekey, plotsizevalue]) => {
              console.log("kk", plotsizekey);
              temp.push(plotsizekey);
            });
          }
        });
      }
    });
    setPlotSizeList(temp);
  }

  function setPlotData(params) {
    setPlotsize(params);
    const firstThreeLetters = tempFile.substring(0, 3);
    const remainingLetters = tempFile.substring(3);
    if (params == "50x100 Sq.Ft") {
      setfileNumber(`${firstThreeLetters}-K${remainingLetters}`); //value added
    } else if (params == "50x50 Sq.Ft") {
      setfileNumber(`${firstThreeLetters}-T${remainingLetters}`);
    } else if (params == "25x50 Sq.Ft") {
      setfileNumber(`${firstThreeLetters}-F${remainingLetters}`);
    }
    SocietyList.forEach((element) => {
      if (element.name === Society) {
        Object.entries(element.catagories).map(([key, value]) => {
          if (key === Catagory) {
            Object.entries(value).map(([plotSizeKey, plotSizeValue]) => {
              if (plotSizeKey === params) {
                setTotalAmount(plotSizeValue.total);
                // setInstallmentMonth(plotSizeValue.noOfInstallments);
                setInstallment(plotSizeValue.installment);
                setDownPayment(plotSizeValue.downpayment);
                setpossessionAmount(plotSizeValue.possession);
                setBookingAmount(plotSizeValue.booking);
                console.log(plotSizeValue);
                if (plotSizeValue.Balloting) {
                  setOtherAmountTitle("Balloting");
                  setOtherAmount(plotSizeValue.Balloting);
                }
              }
            });
          }
        });
      }
    });
  }

  async function getSocieties() {
    const querySnapshot = await getDocs(collection(db, "Society"));
    const cat = [];
    querySnapshot.forEach((doc) => {
      cat.push(doc.data());
    });
    setSocietyList(cat);
  }
  function updateInstalment(t, d, im, p) {
    var total = t - d - p;
    total = total / im;
    setInstallment(total);
  }
  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="container">
              <h1 className="title-form" style={{ textAlign: "justify" }}>
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
                          Society:
                        </label>
                        <select
                          onChange={(e) => {
                            setSociety(e.target.value);
                            getCatagories(e.target.value);
                          }}
                        >
                          <option value="">Select a Society</option>
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
                          Catageory:
                        </label>
                        <select
                          onChange={(e) => {
                            setCatagory(e.target.value);
                            getPlotSizes(e.target.value);
                          }}
                        >
                          <option value="">Select Society First</option>
                          {CatagoryList.map((option) => (
                            <option key={option} value={option}>
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
                        <input
                          type="text"
                          name="Block"
                          value={Block}
                          style={{ width: "100%", padding: "8px" }}
                          onChange={(e) => {
                            setBlock(e.target.value);
                          }}
                        />
                        <p>{BlockError}</p>
                      </div>
                    </div>

                    {/*  */}
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          className="marla-labal"
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Plot Size
                        </label>
                        <select
                          onChange={(e) => {
                            setPlotData(e.target.value);
                          }}
                        >
                          <option value="">Select Catagory First</option>
                          {PlotSizeList.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <p>{PlotSizeError}</p>
                      </div>
                    </div>
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          File Number:
                        </label>
                        <input
                          disabled={!isFileNumberEditable}
                          type="text"
                          name="FileNumber"
                          value={fileNumber}
                          style={{ width: "100%", padding: "8px" }}
                          onChange={(e) => {
                            setfileNumber(e.target.value);
                          }}
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
                            if (parseInt(e.target.value) < -1) {
                              setTotalAmount(0);
                            } else {
                              setTotalAmount(parseInt(e.target.value));
                            }
                            updateInstalment(
                              parseInt(e.target.value),
                              Downpayment,
                              InstallmentMonth,
                              possessionAmount
                            );
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
                          value={Downpayment}
                          onChange={(e) => {
                            if (parseInt(e.target.value) < -1) {
                              setDownPayment(0);
                            } else {
                              setDownPayment(e.target.value);
                              updateInstalment(
                                TotalAmount,
                                parseInt(e.target.value),
                                InstallmentMonth,
                                possessionAmount
                              );
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
                          if (parseInt(e.target.value) < -1) {
                            setpossessionAmount(0);
                          } else {
                            setpossessionAmount(parseInt(e.target.value));
                            updateInstalment(
                              TotalAmount,
                              Downpayment,
                              InstallmentMonth,
                              parseInt(e.target.value)
                            );
                          }
                        }}
                        style={{ width: "100%", padding: "8px" }}
                      />
                      <p>{possessionAmountError}</p>
                    </div>

                    {/*  */}
                    <div className="input-box">
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Installment Months:
                      </label>
                      <input
                        type="number"
                        value={InstallmentMonth}
                        onChange={(e) => {
                          if (parseInt(e.target.value) < -1) {
                            setInstallmentMonth(1);
                          } else {
                            setInstallmentMonth(parseInt(e.target.value));
                            updateInstalment(
                              TotalAmount,
                              Downpayment,
                              parseInt(e.target.value),
                              possessionAmount
                            );
                          }
                        }}
                        style={{ width: "100%", padding: "8px" }}
                      />
                      <p>{InstallmentMonthError}</p>
                    </div>
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Instalment Amount Per Month:
                        </label>
                        <input
                          type="number"
                          value={Installment}
                          style={{ width: "100%", padding: "8px" }}
                        />
                        <p></p>
                      </div>
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
                    if (parseInt(e.target.value) < -1) {
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
                          if (parseInt(e.target.value) < -1) {
                            setOtherAmount(0);
                          } else {
                            setOtherAmount(e.target.value);
                          }
                        }}
                        style={{ width: "100%", padding: "8px" }}
                      />
                    </div>
                  </div>

                  <div className="gender-details">
                    <input type="radio" name="gender" id="dot-1" />
                    <input type="radio" name="gender" id="dot-2" />
                    <input type="radio" name="gender" id="dot-3" />
                    <input type="radio" name="gender" id="dot-4" />
                    {/* <label
                      class="gender-title"
                      style={{ display: "block", marginBottom: "5px" }}
                    > */}
                    {/* Adjustment
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
                    </div> */}
                  </div>
                  <div className="toogle">
                    <h4>Overide Next Of Kin</h4>
                    <label className="switch">
                      <input
                        type="checkbox"
                        onChange={() => {
                          setoverideKin(!overideKin);
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  {overideKin && (
                    <div className="user-details">
                      <div className="input-box">
                        <div style={{ marginBottom: "10px" }}>
                          <label
                            style={{ display: "block", marginBottom: "5px" }}
                          >
                            Name :
                          </label>
                        </div>
                        <input
                          label="Name"
                          name="NameKin"
                          style={{ width: "100%", padding: "8px" }}
                          value={kinName}
                          onChange={(e) => {
                            console.log(e.target.value);
                            setkinName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="input-box">
                        <div style={{ marginBottom: "10px" }}>
                          <label
                            style={{ display: "block", marginBottom: "5px" }}
                          >
                            Relation :
                          </label>
                        </div>
                        <input
                          label="Relation"
                          name="KinRelation"
                          style={{ width: "100%", padding: "8px" }}
                          value={kinRelation}
                          onChange={(e) => {
                            setkinRelation(e.target.value);
                          }}
                        />
                      </div>
                      <div className="input-box">
                        <div style={{ marginBottom: "10px" }}>
                          <label
                            style={{ display: "block", marginBottom: "5px" }}
                          >
                            Phone No :
                          </label>
                        </div>
                        <input
                          type="number"
                          style={{ width: "100%", padding: "8px" }}
                          name="PhNoKin"
                          value={kinPhone}
                          onChange={(e) => {
                            setkinPhone(e.target.value);
                          }}
                        />
                      </div>
                      <div className="input-box">
                        <div style={{ marginBottom: "10px" }}>
                          <label
                            style={{ display: "block", marginBottom: "5px" }}
                          >
                            CNIC No :
                          </label>
                        </div>
                        <input
                          type="number"
                          name="CnicKin"
                          style={{ width: "100%", padding: "8px" }}
                          value={kinCnic}
                          onChange={(e) => {
                            console.log(e.target.value);
                            setkinCnic(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  )}
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
