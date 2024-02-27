import React from "react";
import avatar from "../../Assets/avatar.png";
import "./payslip.css";
function Emppayslip() {
  return (
    <div className="webpage">
      <div className="main-page">
        <div className="sub-page">
          <div className="upper-sec-detail">
            <div className="upper-sec-detail-flex">
              <h1>Company Name</h1>
              <h1>Address</h1>
              <div className="info-details">
                <div className="info-details-col1">
                  <span>Phone Number</span>
                  <span>Insurance id</span>
                  <span>Email</span>
                </div>
                <div className="info-details-col2">
                  <span>0333333333</span>
                  <span>cedke329r32</span>
                  <span>cds@gmail.com</span>
                </div>
              </div>
            </div>
            <div className="image-finance-pay">
              <img src={avatar}></img>
            </div>
          </div>
          <div className="heading-pay-2">
            <h4>Pay slip for month of feb</h4>
          </div>
          <div className="column3-finance-slip">
            <h1></h1>
            <div className="des-col-3-slip">
              <div className="info-details-col3">
                <span>Employee Name</span>
                <span>Designation</span>
                <span>Department</span>
                <span>Salary Month</span>
              </div>
              <div className="info-details-col3">
                <span>Employee Name</span>
                <span>Designation</span>
                <span>Department</span>
                <span>Salary Month</span>
              </div>
            </div>
            <div className="des-col-4-slip">
              <div className="des-col-4-sec-1">
                <div className="des-col-4-iner1">
                  <span>Comments</span>
                  <span>Date</span>
                  <span>PO Number</span>
                </div>
                <div className="des-col-4-iner2">
                  <span>xxxxxxxxxx</span>
                  <span>22-feb-2024</span>
                  <span>311dmfdf1</span>
                </div>
              </div>
              <div className="des-col-4-sec-2">
                <div className="des-col-4-iner4">
                  <span>Company Id</span>
                  <span>Phone</span>
                  <span>Terms</span>
                </div>
                <div className="des-col-4-iner5">
                  <span>xxxxxxxxxx</span>
                  <span>0234444444</span>
                  <span>Due on Recipt</span>
                </div>
              </div>
            </div>
            <div className="des-col-5-slip">
              <div className="col-5-slip-head">
                <h1>Particulars</h1>
                <h1>Advance</h1>
                <h1>Amount</h1>
              </div>
              <div className="inner-slip-col-5">
                <div className="innerslip-col-5">
                  <div className="inner-slip-5-col1">
                    <span>Basic</span>
                    <span>Commision</span>
                    <span>Allowances</span>
                  </div>
                  <div className="inner-slip-5-col1">
                    <span>20000</span>
                    <span>40000</span>
                    <span>600000</span>
                  </div>
                </div>
                <div className="inner-slip-col2">
                  <div className="inner-slip-5-collast">
                    <span>20000</span>
                    <span>200000</span>
                    <span>2000</span>
                  </div>
                </div>
                <div className="inner-slip-col2-end">
                  <div className="inner-slip-5-colend">
                    <span>20000</span>
                    <span>200000</span>
                    <span>2000</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="scndlast-col-payslip">
              <div className="blank"></div>
              <div className="subtotal-pay">
                <h4>SUBTOTAL</h4>
                <div className="subtotal">
                  <h4>20000000</h4>
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
                  <h4>20000000</h4>
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
