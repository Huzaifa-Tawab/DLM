import React, { useEffect, useState } from "react";
import "./plotfile.css";

// import imageava from "./avat.png"
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import isAdmin from "../../../IsAdmin";
import { db } from "../../firebase";
import Loader from "../../components/loader/Loader";
import softx from "../../Assets/SoftXion.png";
import getDate from "../../../GetDDMMYY";
import cnicFormat from "../../../cnicFormatter";
import sign from "./assets/bilal.png";
function PlotFile() {
  const { id } = useParams();
  console.log(id);
  const navi = useNavigate();
  const date = new Date().toDateString();
  const [isLoading, setisLoading] = useState(true);
  const [UserImage, setUserImage] = useState("");
  const [Society, setSociety] = useState();
  const [FileNumber, setFileNumber] = useState("");
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
      setFileNumber(Plot.FileNumber);
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
    <div className="a4-page-plotfile">
    <div className="a4-content">
      <div className="header-plotfile">
        <h1 className="-plotfile">{Society === "Dynamic Land Management" ? "DYNAMIC LAND MANAGEMENT" : Society}</h1>
        <div className="header-section-plotfile">
          <h3>Allotment Form</h3>
        </div>
        <h3 className="plot-info--plotfile">
          Plot No: <span>{FileNumber}</span>
        </h3>
      </div>
      <div className="main-section-plotfile">
        <div className="committee-info-plotfile">
          <div className="left-column-plotfile">
            <p>Date: {FDate}</p>
            <p>The Management Committee,</p>
            <p>{Society === "Dynamic Land Management" ? "DYNAMIC LAND MANAGEMENT" : Society}</p>
          </div>
          <div className="profile-image-plotfile">
            <img src={UserImage} alt="User"></img>
          </div>
        </div>
        <div className="statement-plotfile">
          <p>
            Dear Sir/Madam,<br />
            <strong>I undertake to be bound by all conditions, obligations, and responsibilities printed overleaf in this respect.</strong>
          </p>
        </div>
        <h3 className="section-heading-plotfile">Personal Information</h3>
        <div className="personal-info-plotfile">
          <div className="left">
            <span>Name:</span> <strong>{Name}</strong><br />
            <span>CNIC:</span> <strong>{cnicFormat(Cnic)}</strong><br />
            <span>D.O.B:</span> <strong>{Dob}</strong>
          </div>
          <div className="right-plotfile">
            <span>F/H Name:</span> <strong>{FName}</strong><br />
            <span>Phone No:</span> <strong>{phNo}</strong><br />
            <span>Gender:</span> <strong>{Gender}</strong>
          </div>
        </div>
        <h3 className="section-heading-plotfile">Next to Kin</h3>
        <div className="next-of-kin-plotfile">
          <div className="left-plotfile">
            <span>Name:</span> <strong>{kinOverRiden ? kinOverRiden.name : customerData.NexttoKin}</strong><br />
            <span>Relation:</span> <strong>{kinOverRiden ? kinOverRiden.relation : customerData.KinRelation}</strong>
          </div>
          <div className="right-plotfile">
            <span>Phone No:</span> <strong>{kinOverRiden ? kinOverRiden.phone : customerData.PhNoKin}</strong><br />
            <span>CNIC:</span> <strong>{kinOverRiden ? kinOverRiden.cnic : cnicFormat(customerData.CnicKin)}</strong>
          </div>
        </div>
        <h3 className="section-heading-plotfile">Booking Details</h3>
        <div className="booking-details-plotfile">
          <div className="left">
            <span>File Number:</span> <strong>{FileNumber}</strong><br />
            <span>Plot Size:</span> <strong>{PlotSize}</strong> <br />
          <span>Address:</span> <strong>{Address}</strong>

          </div>
          <div className="right-plotfile">
            <span>Category:</span> <strong>{Category}</strong><br />
            <span>Block:</span> <strong>{Block}</strong><br />
            <span>Status:</span> <strong>{Society === "Dynamic Land Management" ? "Non Developed" : "Partial Developed"}</strong>
            
          </div>
        </div>
        {/* <div className="address-plotfile">
        </div> */}
        <h3 className="section-heading-plotfile">Contract Details</h3>
        <div className="contract-details-plotfile">
          <div className="left-plotfile">
            <span>Adjustment:</span> <strong>{OtherAmountTitle}</strong><br />
            <span>Other Amount Title:</span> <strong>{OtherAmount}</strong>
          </div>
          {/* <div className="right-plotfile">
            <h3>Remaining Amount</h3>
            <span>{TotalAmount - PaidAmount}</span>
          </div> */}
        </div>
        <div className="signatures-plotfile">
          <h3>Signatures</h3>
          <img className="signature-plotfile" src={sign} alt="Admin Signature" />
          <div className="signature-roles-plotfile">
            <h3>Customer</h3>
            <h3>Booking Officer</h3>
            <h3>Admin</h3>
          </div>
        </div>
        <div className="footer-plotfile">
          <p>Computer Generated File Printed on: <strong>{date}</strong></p>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default PlotFile;
