import React, { useEffect, useState } from "react";

// import imageava from "./avat.png"
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import isAdmin from "../../../IsAdmin";
import { db } from "../../firebase";
import Loader from "../../components/loader/Loader";
import softx from "../../Assets/SoftXion.png";
import getDate from "../../../GetDDMMYY";
import cnicFormat from "../../../cnicFormatter";
import dlmlogo from "../../Assets/sliderlogo.png";
import './allotmentplot.css'

function PlotFile() {
  const { id } = useParams();
  console.log(id);
  const navi = useNavigate();
  const date = new Date().toDateString();
  const [isLoading, setisLoading] = useState(true);
  const [UserImage, setUserImage] = useState("");
  const [Society, setSociety] = useState();
  const [FileNumber, setFileNumber] = useState("");
  const [allotmentnumber, setAllotmentNumber] = useState("");
  const [FDate, setFDate] = useState("");
  const [Name, setName] = useState("");
  const [Cnic, setCnic] = useState("");
  const [FName, setFName] = useState("");
  const [Gender, setGender] = useState("");
  const [phNo, setphNo] = useState("");
  const [Dob, setDob] = useState("");
  const [Size, setSize] = useState("");
  const [Address, setAddress] = useState("");
  const [Category, setCategory] = useState("");
  const [Block, setBlock] = useState("");
  const [NexttoKin, setNexttoKin] = useState("");
  const [CnicKin, setCnicKin] = useState("");
  const [KinRelation, setKinRelation] = useState("");
  const [PhNoKin, setPhNoKin] = useState("");
  const [TotalAmount, setTotalAmount] = useState("");
  const [PossessionAmount, setPossessionAmount] = useState("");
  const [DownPayment, setDownPayment] = useState("");
  const [PlotSize, setPlotSize] = useState("");
  const [OtherAmount, setOtherAmount] = useState("");
  const [OtherAmountTitle, setOtherAmountTitle] = useState("");
  const [PaidAmount, setPaidAmount] = useState("");
  const [kinOverRiden, setkinOverRiden] = useState(null);
  const [customerData, setCustomerData] = useState({});
  useEffect(() => {
    if (isAdmin()) {
      getPlotInfo();
    } else {
      navi("/login");
    }
  }, []);
  async function getCustomerInfo(id) {
    const user = doc(db, "Customers", id);
    const UserData = await getDoc(user);

    if (UserData.exists()) {
      console.log("Customer data:", UserData.data());
      const Customer = UserData.data();
      setCustomerData(UserData.data());
      // Customer Dat
      setUserImage(Customer.imgUrl);
      setName(Customer.Name);
      setFName(Customer.FName);
      setCnic(Customer.Cnic);
      setAddress(Customer.Address);
      setGender(Customer.Gender);
      setphNo(Customer.phNo);
      setDob(Customer.Dob);
    
      setPaidAmount(Customer.paidAmount || 0);
      // setPhNo(Customer.PhNo);
      setisLoading(false);
   
    } else {
      navi("/notfound");
    }
  }

  async function getPlotInfo() {
    const plot = doc(db, "Plots", id);
    const PlotData = await getDoc(plot);
    if (PlotData.exists()) {
      getCustomerInfo(PlotData.data()["CustomerId"]);
      console.log("Plot data:", PlotData.data());
      const Plot = PlotData.data();
      // Plot Data
      setBlock(Plot.Block);

      setFileNumber(Plot.FileNumber);
      setFileNumber(Plot.FileNumber);
      setCategory(Plot.Category);
      setAllotmentNumber(Plot.plotAllotmentNo);
      setPossessionAmount(Plot.PossessionAmount);
      setTotalAmount(Plot.TotalAmount);
      setOtherAmountTitle(Plot.OtherAmountTitle || "none");
      setOtherAmount(Plot.OtherAmount || 0);
      setPlotSize(Plot.PlotSize);
      setDownPayment(Plot.DownPayment || 0);
      setSociety(Plot.Society);
      const ms = Plot["creationTime"]["seconds"] * 1000;
      const time = new Date(ms).toDateString();
      setFDate(time);
      console.log(Plot.kinOverriden);

      if (Plot.kinOverriden) {
        setkinOverRiden(Plot.extendedKin);
      }
    } else {
      navi("/notfound");
    }
  }

  return isLoading ? (
    <Loader />
  ) : (
    <div className="allotment-letter a4-page-plotfile">
      <div className="top-logo-">
        
      {/* <img src={dlmlogo} alt="logo" className="logo" /> */}
      <div style={{fontSize: "16px"}}>
      <strong>O.L.M.N:</strong>{allotmentnumber}
      </div>
      </div>
    <div className="header">
      <div className="logo"></div>
      <h1 className="-plotfile">{Society === "Dynamic Land Management" ? "DYNAMIC LAND MANAGEMENT" : Society}</h1>
    </div>
    

    <div className="title-section">
        <h3>ALLOTMENT LETTER</h3>
      </div>
      <div className="profile-image-plotfile">
      <div className="image-user"></div>
            <img src={UserImage} alt="User"></img>
          </div>

      <div className="details-section">
        <div className="applicant-details">
          <h4>APPLICANT DETAILS</h4>
          <div>
            <strong>Name:</strong> {Name}
          </div>
          <div>
            <strong>F/H Name:</strong> {FName}
          </div>
          <div>
            <strong>Phone No:</strong> {phNo}
          </div>
          <div>
            <strong>CNIC:</strong> {cnicFormat(Cnic)}
          </div>
          <div>
            <strong>Gender:</strong> {Gender}
          </div>
          <div>
            <strong>D.O.B:</strong> {Dob}
          </div>
          <div>
            <strong>Address:</strong> {Address}
          </div>
        </div>
        <div className="allotment-details">
          <h4>ALLOTMENT DETAILS</h4>
          <div>
            <strong>File No:</strong> {FileNumber}
          </div> 
          <div>
            <strong>O.L.M.N:</strong> {allotmentnumber}
          </div>
          <div>
            <strong>Block:</strong> {Block}
          </div>
          <div>
            <strong>Size:</strong> {PlotSize}
          </div>
          <div>
            <strong>Category:</strong> {Category}
          </div>
          <div>
            <strong>Status:</strong> {Society === "Dynamic Land Management" ? "Non Developed" : "Partial Developed"}
          </div>
          <div>
            <strong>Adjustment:</strong> {OtherAmountTitle}
          </div>
          <div>
            <strong>Other Amount Title:</strong> {OtherAmount}
          </div>
          <div>
            <strong>POM:</strong>
          </div>

        </div>
        
      </div>

      <div className="terms">
        <p>This letter is issued solely based on the clearance of the land charges, while all other documentation ans charges remain pending</p>
        <br />
        <br />
        <br />
        <br />
        {/* <ol>
          <li>
            This is in continuation of provisional allotment letter issued on dated and the terms and conditions printed overleaf thereof duly accepted and signed by the allottee.
          </li>
          <li>
            The plot, block number, and size are final and will not be changed by {Society === "Dynamic Land Management" ? "DYNAMIC LAND MANAGEMENT" : Society} except on technical grounds.
          </li>
          <li>
            This allotment is not transferable unless authorized by the {Society === "Dynamic Land Management" ? "DYNAMIC LAND MANAGEMENT" : Society}.
          </li>
          <li>
            Please acknowledge receipt of this letter.
          </li>
        </ol> */}
      </div>

      <div className="footer footer-plotfile">
        <div className="date">
          <strong>Dated:</strong> {date}
        </div>
        <div className="signature">
          <p>Director</p>
        </div>
      </div>
      <div className="footer-plotfile">
          <p>Computer Generated File Printed on: <strong>{date}</strong></p>
        </div>
      </div>
  );
}

export default PlotFile;
