import React from "react";
import avatar from "../../Assets/avatar.png";
import "./payslip.css";
import sliderlogo from "../../Assets/sliderlogo.png";
function Emppayslip() {
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
                  <span>0333333333</span>
                  <span>support@propertydlm.com</span>
                  <span>D-17, J-17 Mall, Islamabad, Pakistan</span>
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
                  <span>Employee Name</span>
                  <span>Designation</span>
                  <span>Department</span>
                </div>
                <div className="info-details-col3">
                  <span>Employee Name</span>
                  <span>Designation</span>
                  <span>Department</span>
                </div>
              </div>
              <div className="col-3flex">
                <div className="info-details-col3">
                  <span>CNIC</span>
                  <span>Phone Number</span>
                </div>
                <div className="info-details-col3">
                  <span>13504-3333333-33</span>
                  <span>03123333333</span>
                </div>
              </div>
            </div>
            <div className="column3-finance-slip">
              <h5>Pay Month</h5>
            </div>
            <div className="des-col-4-slip">
              <div className="des-col-4-sec-1">
                <div className="des-col-4-iner1">
                  <span>Date</span>
                  <span>Month Of</span>
                </div>
                <div className="des-col-4-iner2">
                  <span>22-feb-2024</span>
                  <span>February</span>
                </div>
              </div>
            </div>
            <div className="des-col-5-slip">
              <div className="col-5-slip-head">
                <h1>Pay Details</h1>

                <h1>Amount</h1>
              </div>
              <div className="inner-slip-col-5">
                <div className="innerslip-col-5">
                  <div className="inner-slip-5-col1">
                    <span>Basic Pay</span>

                    <span>Allowances</span>
                  </div>
                  <div className="inner-slip-5-col1">
                    <span>20000 Pkr</span>

                    <span>600000 Pkr</span>
                  </div>
                </div>

                <div className="inner-slip-col2-end">
                  <div className="inner-slip-5-colend">
                    <span>20000 Pkr</span>
                    <span>2000 Pkr</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="scndlast-col-payslip">
              <div className="blank"></div>
              <div className="subtotal-pay">
                <h4>SUBTOTAL</h4>
                <div className="subtotal">
                  <h4>20000000 Pkr</h4>
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
                  <h4>20000000 Pkr</h4>
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
