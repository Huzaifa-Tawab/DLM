import React, { useEffect, useState } from "react";
import "./wallet.css";
import SideBar from "../../components/Sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import isAdmin from "../../../IsAdmin";
import arrow from "../../Assets/Plus.png";
import Widrawal from "../../components/Modals/widrawal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import GetAgent from "../../getagent";
import { onAuthStateChanged } from "firebase/auth";

function Wallet() {
  const [ShowWidrawalModal, setShowWidrawalModal] = useState(false);
  const [TotalCredit, setTotalCredit] = useState(0);
  useEffect(() => {
    getCreditRecord();
  }, []);

  const openWidrawalModal = () => {
    setShowWidrawalModal(true);
  };

  const closeWidarawalModal = () => {
    setShowWidrawalModal(false);
  };

  async function getCreditRecord() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;

        const q = query(collection(db, "Credit"), where("agent", "==", uid));
        const querySnapshot = await getDocs(q);
        let total = 0;
        querySnapshot.forEach((doc) => {
          total = +parseInt(doc.data().commission);
          console.log(doc.id, " => ", doc.data());
        });
        setTotalCredit(total);
      }
    });
  }

  return (
    <SideBar
      element={
        <>
          <div className="wallet-main">
            <div className="hero--head">
              <h1>Wallet</h1>
              <button
                onClick={() => {
                  openWidrawalModal(true);
                }}
              >
                Widthraw
                <img src={arrow}></img>
              </button>
            </div>
            <div className="amount-cards">
              <div className="total-amount-main-direct">
                <div className="flex-cards-wallet-com">
                  <div className="wallet-box-head-main">
                    <div className="wallet-total-amount">
                      <h2>Ttotal Amount</h2>
                      <span>{TotalCredit}</span>
                    </div>
                    <br />
                    <div className="wallet-total-amount">
                      <h3>Remaining Amount</h3>
                      <span>150k</span>
                    </div>
                    <br />
                    <div className="wallet-total-amount">
                      <h3>Widhrawal Amount</h3>
                      <span>50k</span>
                    </div>
                  </div>
                </div>
                <div className="wallet-box-head">
                  <h4>Direct Commision</h4>
                  <span>100k</span>
                </div>
              </div>

              <div className="flex-cards-wallet-levels">
                <div className="wallet-box">
                  <h4>Level 1</h4>
                  <span>200k</span>
                </div>
                <div className="wallet-box">
                  <h4>Level 2</h4>
                  <span>50k</span>
                </div>
                <div className="wallet-box">
                  <h4>Level 3</h4>
                  <span>20k</span>
                </div>
                <div className="wallet-box">
                  <h4>Level 4</h4>
                  <span>10k</span>
                </div>
              </div>
            </div>

            <div className="invoice-list">
              <div className="wallet-invoice">
                <h5>Latest Invoices</h5>
                <table className="wallet-invoice-table">
                  <thead>
                    <tr>
                      <th>Invoice Id</th>
                      <th>Nature</th>
                      <th>Date</th>
                      <th>Commision</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Salman</td>
                      <td>Installment</td>
                      <td>28/01/2024</td>
                      <td>10000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="history-records">
                <h5>History</h5>
                <table className="wallet-history-table">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2000</td>
                      <td>28/01/2024</td>
                      <td>Approved/Pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                {/* <h5>History</h5>
            <table className='wallet-history-table'>
                <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2000</td>
                        <td>28/01/2024</td>
                        <td>Approved/Pending</td>
                    </tr>
                </tbody>
            </table> */}
              </div>
              {/* <div className="widdraw-funds">
                <button onClick={() => {
                    openWidrawalModal(true);
                }}>Widthdraw Funds</button>
            </div> */}
            </div>
            <Widrawal
              showModal={ShowWidrawalModal}
              onClose={closeWidarawalModal}
            />
          </div>
        </>
      }
    />
  );
}

export default Wallet;
