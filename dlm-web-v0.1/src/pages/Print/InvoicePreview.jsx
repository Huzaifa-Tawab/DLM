import "./printfile.css";
import { useEffect, useState } from "react";
import dotSharp from "./assets/dots-shap.png";
import { useNavigate, useParams } from "react-router-dom";
import { functions } from "lodash";
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import sliderlogo from "../../Assets/sliderlogo.png";
import isFinance from "../../../IsFinance";
import Loader from "../../components/loader/Loader";
import * as htmlToImage from "html-to-image";
import Logo from "../../components/Sidebar/logo";

function InvoicePreview() {
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
  const [remainingAmount, setRemaingAmount] = useState("");
  const [totalAmount, setTotalamount] = useState("");
  const [tra, setTra] = useState({ null: true });
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    console.log("okk");
    if (true) {
      if (!tra.null) {
        console.log("startijn");
        try {
          htmlToImage
            .toPng(document.getElementById("inv-image"))
            .then((dataUrl) => {
              uploadTofirebase(dataUrl);
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      navigate("/login");
    }
  }, [tra]);
  async function uploadTofirebase(imgData) {
    const coll = collection(db, "PlotAssets");
    const q = query(coll, where("invId", "==", InvoiceNumber));
    const snapshot = await getCountFromServer(q);
    if (snapshot.data().count == 0) {
      setShowLoader(true);
      const docRef = collection(db, "PlotAssets");
      await addDoc(docRef, {
        invId: InvoiceNumber,
        pid: FileNumber,
        img: imgData,
        createdAt: serverTimestamp(),
      })
        .then((_) => {
          window.close();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else{
        window.close();

    }
  }

  async function getData() {
    const docRef = doc(db, "Transactions", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data()["varified"]) {
      const data = docSnap.data();
      setTra(data);
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

      setNature(data["nature"]);
      setSignature(data["Esign"]);
      getPlotData(data["fileNumber"]);
      // window.print();

      // const docRef = doc(db, "Plots", data["fileNumber"]);
      // const docSnap = await getDoc(docRef);

      // if (docSnap.exists() && docSnap.data()["varified"]) {

      // }
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
      navigate("/login");
    }
  }
  async function getPlotData(fn) {
    const docRef = doc(db, "Plots", fn);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // setTotalamount(docSnap.data().TotalAmount);
      setRemaingAmount(docSnap.data().TotalAmount - docSnap.data().paidAmount);
    }
  }

  return <div className="invoice-1-2Pn" id="inv-image">
     
      <div className="auto-group-z6we-Z8p">
        <div className="frame-3608-zjv">
          <div className="secnd-comp-in">
            <img src={sliderlogo} className="secnd-comp-in-head"></img>
            <div className="secnd-comp-in-head-sec">Office</div>
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

                <th>Remaining Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{FileNumber}</td>
                <td>{Nature}</td>
                <td>{panelty}</td>
                <td>{TotalInstalmentAmount}</td>

                <td>{tra.remainingAmount}</td>
              </tr>
            </tbody>
          </table>
          <div className="last-comp-info-last">
            <h4 className="hccc">
              {" "}
              براہ مہربانی رقم بنک اکاونٹ میں جمع کروائیں۔ <br />
              ایجنٹ کو رقم دینے پر رسید لیتے وقت آن لائین تصدیق ضرور کر لیں۔{" "}
              <br />
              بصورت دیگر کمپنی زمہ دار نہ ہو گی۔ <br />
              Non Refundable <br />
              Thanks for the business.
            </h4>

            {/* <img className="sig"src={signature}></img> */}
            <div className="sign">
              {/* <img className="sig" src={signature}></img> */}
              <br />
              <br />
              <br />
              <h3 className="hcccf">Signature</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

}
export default InvoicePreview;
