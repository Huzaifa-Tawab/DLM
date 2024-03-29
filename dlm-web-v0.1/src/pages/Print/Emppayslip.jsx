import React, { useEffect, useState } from "react";
import avatar from "../../Assets/avatar.png";
import "./payslip.css";
import sliderlogo from "../../Assets/sliderlogo.png";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import PaySlip from "../forms/PaySlip";
function Emppayslip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);
  const [employeData, setEmployeData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});

  useEffect(() => {
    getPaySlip();
  }, []);
  async function getPaySlip() {
    const docRef = doc(db, "Payslip", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setInvoiceData(docSnap.data());
      setisLoading(false);
      console.log(id);
      getEmpDetails(docSnap.data().uid);
    } else {
      // docSnap.data() will be undefined in this case
      navigate("/");
    }
  }
  async function getEmpDetails(uid) {
    const docRef = doc(db, "Employe", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setEmployeData(docSnap.data());
      setisLoading(false);
      console.log(id);
      console.log(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      navigate("/");
    }
  }

  return (
    <div className="webpage">
      <div className="main-page">
        <div className="sub-page">
          <div className="upper-sec-detail">
            <div className="upper-sec-detail-flex">
              <img src={sliderlogo} alt="logo"></img>

              <div className="info-details">
                <div className="info-details-col1">
                  <span>Company PH Number</span>
                  <span>Company Mail</span>
                  <span>Company Address</span>
                </div>
                <div className="info-details-col2">
                  <span>0314-5142209</span>
                  <span>support@propertydlm.com</span>
                  <span>Flat No 217, J-7 Mall, D-17 Islamabad</span>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="heading-pay-2">
            <h4>Pay slip for month of feb</h4>
          </div> */}
          <div className="column3-finance-slip">
            <h5>Employee Details</h5>
            <div className="des-col-3-slip">
              <div className="col-3flex">
                <div className="info-details-col3">
                  <span>Employee Name: </span>
                  <span>Designation: </span>
                  <span>Department:</span>
                </div>
                <div className="info-details-col3">
                  <span>{employeData.name}</span>
                  <span>{employeData.designation}</span>
                  <span>{employeData.department}</span>
                </div>
              </div>
              <div className="col-3flex">
                <div className="info-details-col3">
                  <span>CNIC:</span>
                  <span>Phone Number:</span>
                </div>
                <div className="info-details-col3">
                  <span>{employeData.cnic}</span>
                  <span>{employeData.phone}</span>
                </div>
              </div>
            </div>
            <div className="column3-finance-slip">
              <h5>Pay Month</h5>
            </div>
            <div className="des-col-4-slip">
              <div className="des-col-4-sec-1">
                <div className="des-col-4-iner1">
                  <span>Date:</span>
                  <span>Month Of:</span>
                </div>
                <div className="des-col-4-iner2">
                  <span>{invoiceData.salarydate}</span>
                  <span>{invoiceData.salarymonth}</span>
                </div>
              </div>
            </div>
            <div className="des-col-5-slip">
              <div className="blank"></div>
              <div className="col-5-slip-head">
                <h1>Pay Details</h1>

                <h1 className="amount">Amount</h1>
              </div>
              <div className="inner-slip-col-5">
                <div className="blank"></div>
                <div className="innerslip-col-5">
                  <div className="inner-slip-5-col1">
                    <span>Basic Pay:</span>

                    <span>Allowances:</span>
                  </div>
                  <div className="inner-slip-5-col1">
                    <span></span>

                    <span></span>
                  </div>
                </div>

                <div className="inner-slip-col2-end">
                  <div className="inner-slip-5-colend">
                    <span>{invoiceData.basicpay}</span>
                    <span>{invoiceData.allowance}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="scndlast-col-payslip">
              <div className="blank"></div>
              <div className="subtotal-pay">
                <h4>SUBTOTAL</h4>
                <div className="subtotal">
                  <h4>
                    {parseInt(invoiceData.basicpay) +
                      parseInt(invoiceData.allowance)}
                  </h4>
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="last-col-payslip">
              <div className="blank"></div>
              <div className="Net-Salary">
                <h4>NET SALARY</h4>
                <div className="subtotal">
                  <h4>{invoiceData.netsalary}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="slip-finance-signature">
            <div className="sig-underline"></div>
            <h4>Employee's Signature</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emppayslip;
