import React from "react";
import "./footer.css";
import logo from "../../Assets/SoftXion.png";

function Footer() {
  return (
    <>
      <div></div>
      <div className="footer">
        <div className="footer-data">
          <img src={logo} alt="" />
          <br />
          <br />
          <span>
            Our vision is to provide convenience <br />
            and help increase your sales business.
          </span>
          <div className="divider"></div>
          <div className="footrbar">
            <p>©2024 SoftXion. All rights reserved</p>
            <div className="policy">
              <p>Privacy & Policy</p>
              <p>Terms & Condition</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
