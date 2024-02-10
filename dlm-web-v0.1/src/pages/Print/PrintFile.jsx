import React, { useEffect, useState } from "react";
import "./printInvoice.css";
// import imageava from "./avat.png"
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import isAdmin from "../../../IsAdmin";
import { db } from "../../firebase";
import Loader from "../../components/loader/Loader";
import softx from "../../Assets/SoftXion.png";

function PrintFile() {
  const { id } = useParams();
  console.log(id);
  const navi = useNavigate();

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
  const [TownCity, setTownCity] = useState("");
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

  useEffect(() => {
    if (isAdmin()) {
      getPlotInfo();
    } else {
      navi("/login");
    }
  }, []);
  async function getCustomerInfo(id) {
    console.log("hello");
    const user = doc(db, "Customers", id);
    const UserData = await getDoc(user);

    if (UserData.exists()) {
      setisLoading(false);
      console.log("Customer data:", UserData.data());
      const Customer = UserData.data();
      // Customer Data

      setUserImage(Customer.imgUrl);
      setName(Customer.Name);
      setFName(Customer.FName);
      setCnic(Customer.Cnic);
      setTownCity(Customer.TownCity);
      setAddress(Customer.Address);
      setGender(Customer.Gender);
      setphNo(Customer.phNo);
      setDob(Customer.Dob);
      setNexttoKin(Customer.NexttoKin);
      setCnicKin(Customer.CnicKin);
      setKinRelation(Customer.KinRelation);
      setPhNoKin(Customer.PhNoKin);
      // setPhNo(Customer.PhNo);
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

      setFileNumber(Plot.FileNumber);
      setFileNumber(Plot.FileNumber);
      setCategory(Plot.Category);
      setFileNumber(Plot.FileNumber);
      setPossessionAmount(Plot.PossessionAmount);
      setTotalAmount(Plot.TotalAmount);
      setOtherAmountTitle(Plot.OtherAmountTitle);
      setOtherAmount(Plot.OtherAmount);
      setPlotSize(Plot.PlotSize);
      setDownPayment(Plot.DownPayment);
      setSociety(Plot.Society);
      const ms = Plot["creationTime"]["seconds"] * 1000;
      const time = new Date(ms).toDateString();
      setFDate(time);
    } else {
      navi("/notfound");
    }
  }

  return isLoading ? (
    <Loader />
  ) : (
    <div className="webpage">
      <div className="main-page">
        <div className="sub-page">
          <div className="top-head">
            <h1>
              {Society === "Dyanmic Land Management"
                ? "DYNAMIC LAND MANAGEMENT"
                : "D LEGENDS MARKETING"}
            </h1>

            <div className="top-sec-cont">
              <h3>BOOKING FORM</h3>
            </div>

            <h3 className="top-thrd-cont">
              File No: <span>{FileNumber}</span>
            </h3>
          </div>
          <div className="sec-section">
            <div className="head-top-cont">
              <div className="top-p-fle">
                <p>Date: {FDate}</p>
                <p>The Management committee,</p>
                <p>Dynamic Land Management</p>
              </div>
              <div className="imgtop">
                <img src={UserImage}></img>
              </div>
            </div>
            <div className="head-content">
              <p className="sec-section-last">
                Dear Sir/ Madam,
                <br />
                <span>
                  I Undertake to be bounded by all such conditions, obligations
                  and responsibilities as printed overleaf in this respect, make
                  there under.
                </span>
              </p>
            </div>
            <div className="top-sec-heading">
              <h3>PERSONAL INFORMATION</h3>
            </div>

            <div className="sectop-section-content">
              <div className="sectop-row">
                <div className="column-1">
                  <span>Name:</span>
                  <span>Cnic:</span>
                  <span>D.O.B:</span>
                </div>
                <div className="column-2">
                  <span>{Name}</span>
                  <span>{Cnic}</span>
                  <span>{Dob}</span>
                </div>
              </div>
              <div className="sectop-right">
                <div className="column-3">
                  <span>FName:</span>
                  <span>Phone No:</span>
                  <span>Gender:</span>
                </div>
                <div className="column-4">
                  <span>{FName}</span>
                  <span>{phNo}</span>
                  <span>{Gender}</span>
                </div>
              </div>
            </div>
            <div className="top-sec-heading">
              <h3>NEXT TO KIN</h3>
            </div>

            <div className="sectop-section-content">
              <div className="sectop-row">
                <div className="column-1">
                  <span>Name:</span>
                  <span>Relation:</span>
                </div>
                <div className="column-2">
                  <span>{NexttoKin}</span>
                  <span>{KinRelation}</span>
                </div>
              </div>
              <div className="sectop-right-33">
                <div className="column-33">
                  <span>Phone No:</span>
                  <span>Cnic:</span>
                </div>
                <div className="column-44">
                  <span>{PhNoKin}</span>
                  <span>{CnicKin}</span>
                </div>
              </div>
            </div>
            <div className="top-sec-heading">
              <h3>BOOKING DETAILS</h3>
            </div>

            <div className="sectop-section-content">
              <div className="sectop-row">
                <div className="column-1">
                  <span>File Number:</span>
                  <span>Plot Size:</span>
                  <span>Address:</span>
                </div>
                <div className="column-2">
                  <span>{FileNumber}</span>
                  <span>{PlotSize} Marla</span>
                  <span>{Address}</span>
                </div>
              </div>
              <div className="sectop-right-44">
                <div className="column-333">
                  <span>Category:</span>
                  <span>Town/City:</span>
                </div>
                <div className="column-444">
                  <span>{Category}</span>
                  <span>{TownCity}</span>
                </div>
              </div>
            </div>
            <div className="top-sec-heading">
              <h3>CONTRACT DETAILS</h3>
            </div>
            <div className="sectop-section-content">
              <div className="sectop-row">
                <div className="columnfrth-sec">
                  <span>Adjustment:</span>
                  <span>Other Amount: </span>
                  <span> Amount:</span>
                </div>
                <div className="column-2">
                  <form className="chckbox-flex">
                    <label> C.</label>
                  </form>
                  <span className="underline-1">{OtherAmountTitle}</span>
                  <span className="underline-1">{OtherAmount}</span>
                </div>
              </div>
              <div className="sectop-right-last">
                <div className="column-7">
                  <span>Total Price:</span>
                  <span>Possession Amount:</span>
                  <span>Down Payment:</span>
                  <br />
                  <h3 className="bold-700">Total Amount</h3>
                </div>
                <div className="column-8">
                  <span className="underline-1">{TotalAmount}</span>
                  <span className="underline-1">{PossessionAmount}</span>
                  <span className="underline-1">{DownPayment}</span>
                  <br />
                  <h3 className="bold-400">{TotalAmount}</h3>
                </div>
              </div>
            </div>
            <div className="top-last-heading"></div>
            <div className="last-text-content">
              <span>Note:</span>
              <p>
                Permission of plot will be as per schedule i.e 62 Months from
                the date of booking.
              </p>
              <p>
                {Society === "Dyanmic Land Management" &&
                  "Non Developed Society"}
              </p>
            </div>
            <div className="signatures-text">
              <h3>Signatures</h3>
            </div>
            <div className="signature-area">
              <h3>Customer</h3>
              <h3>Booking Officer</h3>
              <h3>Admin</h3>
            </div>
            {/* <div className="foter-softxion">
        <h5>This site is created by  </h5>
        <div>
          <img src={softx } alt=""></img>
          <h3>Email:info@softxion.com</h3>
          </div>
        </div> */}
            {/* code is in schedule.css */}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintFile;
