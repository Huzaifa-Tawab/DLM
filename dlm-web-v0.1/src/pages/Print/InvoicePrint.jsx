import "./printfile.css";
import { useEffect, useState } from "react";
import dotSharp from "./assets/dots-shap.png";
import { useNavigate, useParams } from "react-router-dom";
import { functions } from "lodash";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import signature from "../../Assets/signature.png";
function PrintInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [Name, setName] = useState("");
  const [FName, setFName] = useState("");
  const [Category, setCategory] = useState("");
  const [InvoiceNumber, setInvoiceNumber] = useState("");
  const [InvoiceDate, setInvoiceDate] = useState("");
  const [TotalInstalmentAmount, setTotalInstalmentAmount] = useState("");
  const [FileNumber, setFileNumber] = useState("");
  const [Qty, setQty] = useState("1");
  const [InstalmentAmount, setInstalmentAmount] = useState("");
  const [panelty, setpanelty] = useState("0.0");
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const docRef = doc(db, "Transactions", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data()["varified"]) {
      const data = docSnap.data();
      setName(data["customerName"]);
      const ms = data["time"]["seconds"] * 1000;
      const time = new Date(ms).toDateString();
      setInvoiceDate(time);
      setFName(data["customerLastName"]);
      setCategory(data["Category"]);
      setInvoiceNumber(data["InvId"]);
      setTotalInstalmentAmount(data["total"]);
      setFileNumber(data["fileNumber"]);
      setInstalmentAmount(data["total"]);
      setpanelty(data["penalty"]);
      // window.print();
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
      navigate("/login");
    }
  }

  return (
    <div className="invoice-1-2Pn">
      <div className="auto-group-z6we-Z8p">
        <div className="frame-3608-zjv">
        <div className="secnd-comp-in">
          <p className="secnd-comp-in-head">DLM</p>
          <div className="secnd-comp-in-head-sec">Customer Copy</div>
          <p className="secnd-comp-in-head">Sydney Hawks 7</p>
          </div>
         <div className="sec-detl-comp">
          <div className="info-sec-col">
            <h3 className="hff">Name:</h3>
            <h3 className="hff">Father/Husband Name:</h3>
            <h3 className="hff">Category:</h3>
          </div>
          <div className="info-name-sec-col">
            <h3 className="hrr">ahmad</h3>
            <h3 className="hrr"> khan khanhelo</h3>
            <h3 className="hrr">helooo helo</h3>
          </div>
          <div className="info-inv-thrd">
            <h3 className="hfc">invoice num:</h3>
            {/* <h3 className="tcs">hfiiufhiucfui</h3> */}
            <h3 className="hff"> invoice date:</h3>
            {/* <h3 className="tcs">24-feb-2121</h3> */}
            <h3 className="hff">Total Installement Amount:</h3>
          </div>
          <div className="info-inv-frth">
          <h3 className="tcs">hfiiufhiucfui</h3>
          <h3 className="tcs">24-feb-2121</h3>
            {/* <h3 className="hff">Total Installement Amount</h3> */}
            <h3 className="val-sec">Rs 3145666</h3>
          </div>
        </div>
        <div className="last-comp">
          <h3 className="hfff">File Number</h3>
          <h3 className="hfff">Nature</h3>
          <h3 className="hfff">Amount</h3>
          <h3 className="hfff">Panelty</h3>
        </div>
        <div className="last-comp-info">
          <h3 className="hfcc">File Number</h3>
          <h3 className="hfcc">Nature</h3>
          <h3 className="hfcc">Amount</h3>
          <h3 className="hfcc">Panelty</h3>
        </div>
        <div className="last-comp-info-last">
        <h3 className="hccc">Thanks for the business</h3>
          {/* <img className="sig"src={signature}></img> */}
        <div className="sign">
        <img className="sig"src={signature}></img>

        <h3 className="hcccf">
            
            Signature</h3>
        </div>
        </div>
        <div className="cut"></div>
        <div className="secnd-comp-inter">
          <p className="secnd-comp-in-head">DLM</p>
          <div className="secnd-comp-in-head-sec">Office Copy</div>
          <p className="secnd-comp-in-header">DLM: ewbiucbixfb  </p>
          </div>
         <div className="sec-detl-comp">
          <div className="info-sec-col">
            <h3 className="hff">Name:</h3>
            <h3 className="hff">Father/Husband Name:</h3>
            <h3 className="hff">Category:</h3>
          </div>
          <div className="info-name-sec-col">
            <h3 className="hrr">ahmad</h3>
            <h3 className="hrr"> khan khanhelo</h3>
            <h3 className="hrr">helooo helo</h3>
          </div>
          <div className="info-inv-thrd">
          <h3 className="hfc">invoice num:</h3>
            {/* <h3 className="tcs">hfiiufhiucfui</h3> */}
            <h3 className="hff"> invoice date:</h3>
            {/* <h3 className="tcs">24-feb-2121</h3> */}
            <h3 className="hff">Total Installement Amount:</h3>
          </div>
          <div className="info-inv-frth">
          <h3 className="tcs">hfiiufhiucfui</h3>
          <h3 className="tcs">24-feb-2121</h3>
            {/* <h3 className="hff">Total Installement Amount</h3> */}
            <h3 className="val-sec">Rs 3145666</h3>
          </div>
        </div>
        <div className="last-comp">
          <h3 className="hfff">File Number</h3>
          <h3 className="hfff">Nature</h3>
          <h3 className="hfff">Amount</h3>
          <h3 className="hfff">Panelty</h3>
        </div>
        <div className="last-comp-info">
          <h3 className="hfcc">File Number</h3>
          <h3 className="hfcc">Nature</h3>
          <h3 className="hfcc">Amount</h3>
          <h3 className="hfcc">Panelty</h3>
        </div>
        <div className="last-comp-info-last">
          <h3 className="hccc">Thanks for the business</h3>
          {/* <img className="sig"src={signature}></img> */}
        <div className="sign">
        <img className="sig"src={signature}></img>

        <h3 className="hcccf">
            
            Signature</h3>
        </div>
        </div>

        
        
        </div>
      </div>
    </div>
  );
}
export default PrintInvoice;
