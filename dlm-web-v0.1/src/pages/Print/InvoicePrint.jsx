import "./printInvoice.css";
import { useEffect, useState } from "react";
import dotSharp from "./assets/dots-shap.png";
import { useNavigate, useParams } from "react-router-dom";
import { functions } from "lodash";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
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
        <img className="dots-shap-UFn" src={dotSharp} />
        <div className="frame-3608-zjv">
          <p className="dml-KXJ">DLM</p>
          <div className="auto-group-ctfe-cmJ">
            <div className="auto-group-5xz6-LxC">
              <div className="frame-3638-HMe">
                <p className="name-EGt">Name</p>
                <p className="father-husband-name--Zpx">
                  <span className="father-husband-name--Zpx-sub-0">Father</span>
                  <span className="father-husband-name--Zpx-sub-1">
                    /
                    <br />
                  </span>
                  <span className="father-husband-name--Zpx-sub-2">
                    Husband
                  </span>
                  <span className="father-husband-name--Zpx-sub-3"> </span>
                  <span className="father-husband-name--Zpx-sub-4">Name</span>
                  <span className="father-husband-name--Zpx-sub-5"> :</span>
                </p>
              </div>
              <p className="category--wU8">Category : </p>
            </div>
            <div className="auto-group-zchr-ggc">
              <div className="auto-group-one8-Sfn">
                <p className="isfan-arif-mCG">{Name}</p>
                <p className="isfan-arif-hLp">{FName}</p>
                <p className="a-ErY">{Category}</p>
              </div>
              <div className="auto-group-pwfv-ndA">
                <div className="frame-3611-Leg">
                  <p className="invoice-number-tw6">Invoice number</p>
                  <p className="ab2324-01-2nQ">{InvoiceNumber}</p>
                </div>
                <div className="frame-3609-ySk">
                  <p className="invoice-date-LHJ">Invoice date</p>
                  <p className="aug-2023-so2">{InvoiceDate}</p>
                </div>
              </div>
              <div className="frame-3614-R3r">
                <p className="total-instalment-amount-n9J">
                  Total Instalment Amount{" "}
                </p>
                <p className="rs-666666-i2x">Rs {TotalInstalmentAmount}</p>
              </div>
            </div>
          </div>
          <div className="auto-group-qlkw-dfi">
            <p className="thanks-for-the-business-xhz">
              Thanks for the business.
            </p>
            <p className="customer-signature-Gig">Customer Signature</p>
          </div>
          <div className="auto-group-b8ds-1RN">
            <p className="file-number-Xec">File Number</p>
            <p className="qty-qvC">Qty</p>
            <p className="instalment-amount-mJ4"> Instalment Amount</p>
            <p className="panelty-HnC">panelty</p>
          </div>
          <img className="vector-144-d5N" src="REPLACE_IMAGE:4:161" />
          <img className="vector-145-Zji" src="REPLACE_IMAGE:4:162" />
          <div className="auto-group-yrts-WQ4">
            <p className="dml009834-3Pz">{FileNumber}</p>
            <p className="item-1-BWC">{Qty}</p>
            <p className="item-666600-j1v">{InstalmentAmount}</p>
            <p className="item-000-d7J">{panelty}</p>
          </div>
          <div className="line-328-yBA"></div>
          <div className="auto-group-mqnk-uKi">
            <p className="dml-pha">DLM</p>
            <div className="auto-group-qkui-9Ux">Customer Copy</div>
          </div>
        </div>
      </div>
      <div className="auto-group-hama-9tG">
        <div className="frame-3640-cG4">
          <p className="dml-KJt">DLM</p>
          <div className="auto-group-rtcq-c36">
            <div className="auto-group-j6vg-w5N">
              <div className="frame-3638-gHr">
                <p className="name-BkQ">Name</p>
                <p className="father-husband-name--HoS">
                  <span className="father-husband-name--HoS-sub-0">Father</span>
                  <span className="father-husband-name--HoS-sub-1">
                    /
                    <br />
                  </span>
                  <span className="father-husband-name--HoS-sub-2">
                    Husband
                  </span>
                  <span className="father-husband-name--HoS-sub-3"> </span>
                  <span className="father-husband-name--HoS-sub-4">Name</span>
                  <span className="father-husband-name--HoS-sub-5"> :</span>
                </p>
              </div>
              <p className="category--7fz">Category : </p>
            </div>
            <div className="auto-group-acm2-rtU">
              <div className="auto-group-pbrv-pKW">
                <p className="isfan-arif-M4Y">{Name}</p>
                <p className="isfan-arif-tqA">{FName}</p>
                <p className="a-Eu2">{Category}</p>
              </div>
              <div className="auto-group-wiax-nQk">
                <div className="frame-3611-Kfa">
                  <p className="invoice-number-gFE">Invoice number</p>
                  <p className="ab2324-01-DFA">{InvoiceNumber}</p>
                </div>
                <div className="frame-3609-9ec">
                  <p className="invoice-date-6pk">Invoice date</p>
                  <p className="aug-2023-e5a">{InvoiceDate}</p>
                </div>
              </div>
              <div className="frame-3614-nBn">
                <p className="total-instalment-amount-Ygk">
                  Total Instalment Amount{" "}
                </p>
                <p className="rs-666600-5At">Rs{TotalInstalmentAmount}</p>
              </div>
            </div>
          </div>
          <div className="auto-group-nhhv-Qix">
            <p className="thanks-for-the-business-9Ak">
              Thanks for the business.
            </p>
            <p className="customer-signature-fPz">Customer Signature</p>
          </div>
          <div className="auto-group-3jgt-nzQ">
            <p className="file-number-KjS">File number</p>
            <p className="qty-TKr">Qty</p>
            <p className="instalment-amount-Bme"> Instalment Amount</p>
            <p className="panelty-VXS">panelty</p>
          </div>
          <img className="vector-144-ppc" src="REPLACE_IMAGE:9:64" />
          <img className="vector-145-N5S" src="REPLACE_IMAGE:9:65" />
          <div className="auto-group-vnwe-htQ">
            <p className="dml009834-e2x">{FileNumber}</p>
            <p className="item-1-BYg">{Qty}</p>
            <p className="item-666600-iYc">{InstalmentAmount}</p>
            <p className="item-000-8MS">{panelty}</p>
          </div>
          <div className="line-328-51n"></div>
          <div className="auto-group-rttz-oiU">
            <p className="dml-k7v">DLM</p>
            <div className="auto-group-3atc-UZi">Office Copy</div>
          </div>
        </div>
        <div className="line-329-iU4"></div>
      </div>
    </div>
  );
}
export default PrintInvoice;
