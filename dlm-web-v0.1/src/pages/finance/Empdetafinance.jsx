import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import avatar from "../../Assets/avatar.png";
import SideBar from "../../components/Sidebar/sidebar";

import "./employs.css";

function Empdetafinance() {
  const navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false);

  return (
    <>
      <SideBar
        element={
          isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="empdatafinance-main">
                <div className="empl-hero-head">
                  <h3>Employee Detail</h3>
                </div>
                <div className="empdata-column-1">
                  <div className="empdata-coldata-1">
                    <div className="coldata-1-img">
                      <img src={avatar}></img>
                    </div>
                    <div className="coldata-1-data">
                      <div className="col-data-1">
                        <h5>Name</h5>
                        <h5>Address</h5>
                        <h5>Cnic</h5>
                      </div>
                      <div className="col-data-2">
                        <span>Name</span>
                        <span>employ address</span>
                        <span>emply cnic number</span>
                      </div>
                    </div>
                  </div>
                  <div className="empdata-colmn-2">
                    <div className="empl-hero-head-sec">
                      <h4>Pay Invoices</h4>
                    </div>
                    <div className="mainbox">
                      <div className="content-sec">
                        <div className="content-inner">
                          <span>Invoice ID:</span>
                          <span>Date:1 March 2024</span>
                        </div>
                        <div className="slip-print-finance-btn">
                          <button
                            onClick={() => {
                              navigate("/emppayslip");
                            }}
                          >
                            view
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      />
    </>
  );
}

export default Empdetafinance;
