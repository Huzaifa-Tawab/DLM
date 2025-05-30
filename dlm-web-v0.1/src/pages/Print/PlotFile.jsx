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
import sign from "./assets/bilal-croped.png";

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
  const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
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
      {/* <div className="logo"></div> */}
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
            <strong>Size:</strong> {PlotSize}
          </div>
          <div>
            <strong>RC:</strong> {Society === "Dynamic Land Management" ? "ND" : "PD"}-{Category[0]}-{Block[0]}-{generateRandomString()}
          </div>
            <br />
            <div>
            <strong>Plot No:</strong> ____________________________
            </div>
            <br />
            <div>
            <strong>Location:</strong> ___________________________  
            </div>
        </div>
        
      </div>

      <div className="terms">
        <p>This letter is issued solely based on the clearance of the land charges, while all other documentation and charges remain pending</p>
      </div>

       {/* Affidavit Section */}
       <div className="affidavit-section">
        <h4>AFFIDAVIT</h4>
        <p>
          This is to certify that we, <strong>{Society}</strong>, have received the full/partial payment for the land amount from <strong>{Name}</strong> (hereinafter referred to as "the Buyer").
        </p>
        <p>
          Upon the payment of development charges, we hereby affirm and undertake the following responsibilities:
        </p>
        <ol>
          <li>
            <strong>Provision of Plot:</strong> We are responsible for providing the Buyer with a duly allocated plot as per the agreed terms and conditions.
          </li>
          <li>
            <strong>Basic Amenities:</strong> We commit to ensuring the provision of the following basic facilities for comfortable living:
            <ul>
              <li>Electricity</li>
              <li>Roads and Streets</li>
              <li>Other Necessary Facilities</li>
            </ul>
          </li>
        </ol>
        <p>
          We assure the Buyer that all necessary development work will be carried out in a timely and professional manner, adhering to the highest standards of quality and safety.
        </p>
        <p>
          This affidavit serves as a formal commitment to fulfill our obligations as stated above.
        </p>
      </div>
        <div style={{display:"flex",justifyContent:"end"}}> <img width={"200px"} src={sign}></img></div>

      <div className="footer-plotfile">

        <div className="date">
          <strong>Dated:</strong> {date}
        </div>
        <div className="signature">   
          <p>Director</p>
        </div>
      </div>
      {/* <div className="footer-plotfile">
          <p>Computer Generated File Printed on: <strong>{date}</strong></p>
        </div> */}
      </div>
  );
}

export default PlotFile;
