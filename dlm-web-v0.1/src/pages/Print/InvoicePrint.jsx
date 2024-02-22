import "./printfile.css";
import { useEffect, useState } from "react";
import dotSharp from "./assets/dots-shap.png";
import { useNavigate, useParams } from "react-router-dom";
import { functions } from "lodash";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import sliderlogo from "../../Assets/sliderlogo.png";

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
  const [Nature, setNature] = useState("");
  const [InstalmentAmount, setInstalmentAmount] = useState("");
  const [panelty, setpanelty] = useState("0.0");
  const [Society, setSociety] = useState("0");
  const [signature, setSignature] = useState("");
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
      setSociety(data["Society"]);
      console.log(data["Society"]);
      setNature(data["nature"]);
      setSignature(data["Esign"]);

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
            <img src={sliderlogo} className="secnd-comp-in-head"></img>
            <div className="secnd-comp-in-head-sec">Customer Copy</div>
            <p className="secnd-comp-in-head">{Society}</p>
          </div>
          <div className="sec-detl-comp">
            <div className="info-sec-col">
              <h3 className="hff">Name:</h3>
              <h3 className="hff">F/H Name:</h3>
              <h3 className="hff">Category:</h3>
            </div>
            <div className="info-name-sec-col">
              <h3 className="hrr">{Name}</h3>
              <h3 className="hrr"> {FName}</h3>
              <h3 className="hrr">{Category}</h3>
            </div>
            <div className="info-inv-thrd">
              <h3 className="hfc">Invoice Numer:</h3>
              {/* <h3 className="tcs">hfiiufhiucfui</h3> */}
              <h3 className="hff"> Issue Date:</h3>
              {/* <h3 className="tcs">24-feb-2121</h3> */}
              <h3 className="hff">Invoice Amount:</h3>
            </div>
            <div className="info-inv-frth">
              <h3 className="tcs">{InvoiceNumber}</h3>
              <h3 className="tcs">{InvoiceDate}</h3>
              <h3 className="val-sec">{TotalInstalmentAmount}</h3>
            </div>
          </div>
          <table className="fl-table invoice-table">
            <thead>
              <tr>
                <th>File Number</th>
                <th>Nature</th>
                <th>Penalty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{FileNumber}</td>
                <td>{Nature}</td>
                <td>{panelty}</td>
                <td>{TotalInstalmentAmount}</td>
              </tr>
            </tbody>
          </table>
          <div className="last-comp-info-last">
            <h4 className="hccc">
              {" "}
              براہ مہربانی رقم بنک اکاونٹ میں جمع کروائیں۔ <br />
              ایجنٹ کو رقم دینے پر رسید لیتے وقت آن لائین تصدیق ضرور کر لیں۔{" "}
              <br />
              بصورت دیگر کمپنی زمہ دار نہ ہو گی۔ <br />
              Non Refundable <br />
              Thanks for the business
            </h4>

            {/* <img className="sig"src={signature}></img> */}
            <div className="sign">
              <img className="sig" src={signature}></img>

              <h3 className="hcccf">Signature</h3>
            </div>
          </div>
          <div className="cut"></div>
          <div className="secnd-comp-inter">
            <img src={sliderlogo} className="secnd-comp-in-head"></img>
            <div className="secnd-comp-in-head-sec">Office Copy</div>
            <p className="secnd-comp-in-head">{Society}</p>

            {/* <p className="secnd-comp-in-header">DLM: ewbiucbixfb  </p> */}
          </div>
          <div className="sec-detl-comp">
            <div className="info-sec-col">
              <h3 className="hff">Name:</h3>
              <h3 className="hff">F/H Name:</h3>
              <h3 className="hff">Category:</h3>
            </div>
            <div className="info-name-sec-col">
              <h3 className="hrr">{Name}</h3>
              <h3 className="hrr">{FName}</h3>
              <h3 className="hrr">{Category}</h3>
            </div>
            <div className="info-inv-thrd">
              <h3 className="hfc">Invoice Number:</h3>
              {/* <h3 className="tcs">hfiiufhiucfui</h3> */}
              <h3 className="hff"> Issue Date:</h3>
              {/* <h3 className="tcs">24-feb-2121</h3> */}
              <h3 className="hff">Invoice Amount:</h3>
            </div>
            <div className="info-inv-frth">
              <h3 className="tcs">{InvoiceNumber}</h3>
              <h3 className="tcs">{InvoiceDate}</h3>
              {/* <h3 className="hff">Total Installement Amount</h3> */}
              <h3 className="val-sec">{TotalInstalmentAmount}</h3>
            </div>
          </div>
          <table className="fl-table invoice-table">
            <thead>
              <tr>
                <th>File Number</th>
                <th>Nature</th>
                <th>Penalty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{FileNumber}</td>
                <td>{Nature}</td>
                <td>{panelty}</td>
                <td>{TotalInstalmentAmount}</td>
              </tr>
            </tbody>
          </table>
          {/* <div className="last-comp">
          <h3 className="hfff">File Number</h3>
          <h3 className="hfff">Nature</h3>
          <h3 className="hfff">Amount</h3>
          <h3 className="hfff">Panelty</h3>
        </div> */}
          {/* <div className="last-comp-info">
          <h3 className="hfcc">{FileNumber}</h3>
          <h3 className="hfcc">{Nature}</h3>
          <h3 className="hfcc">{TotalInstalmentAmount}</h3>
          <h3 className="hfcc">{panelty}</h3>
        </div> */}
          <div className="last-comp-info-last">
            <h4 className="hccc">
              {" "}
              براہ مہربانی رقم بنک اکاونٹ میں جمع کروائیں۔ <br />
              ایجنٹ کو رقم دینے پر رسید لیتے وقت آن لائین تصدیق ضرور کر لیں۔{" "}
              <br />
              بصورت دیگر کمپنی زمہ دار نہ ہو گی۔ <br /> Non Refundable <br />
              Thanks for the business
            </h4>
            {/* <img className="sig"src={signature}></img> */}
            <div className="sign">
              <img className="sig" src={signature}></img>

              <h3 className="hcccf">Signature</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PrintInvoice;
