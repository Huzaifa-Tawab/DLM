import React, { useState } from 'react';
import './wallet.css';
import SideBar from '../../components/Sidebar/sidebar';
import { useNavigate } from "react-router-dom";
import isAdmin from "../../../IsAdmin";
import arrow from "../../Assets/Plus.png";
import Widrawal from '../../components/Modals/widrawal';

function Wallet() {
  const [ShowWidrawalModal, setShowWidrawalModal] = useState(false);

  const openWidrawalModal = () => {
    setShowWidrawalModal(true);
  };

  const closeWidarawalModal = () => {
    setShowWidrawalModal(false);
  };

  return (
    <SideBar element={
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
        <div className="flex-cards-wallet-com">
            <div className="wallet-box">
                <h4>Ttotal Amount</h4>
                <span>200k</span>
            </div>
            <div className="wallet-box">
                <h4>Direct Commision</h4>
                <span>100k</span>
            </div>
            
        </div>
        <div className="flex-cards-wallet-levels">
        <div className="wallet-box">
                <h4>Level 1 Commision</h4>
                <span>200k</span>
            </div>
            <div className="wallet-box">
                <h4>Level 2 Commision</h4>
                <span>50k</span>
            </div>
            <div className="wallet-box">
                <h4>Level 3 Commission</h4>
                <span>20k</span>
            </div>
            <div className="wallet-box">
                <h4>Level 4 Commision</h4>
                <span>10k</span>
            </div>
        </div>
    
    <div className="invoice-list">
        <div className="wallet-invoice">
        <h5>Latest Invoices</h5>
        <table className='wallet-invoice-table'>
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
                    <td>
                        28/01/2024
                    </td>
                    <td>10000</td>
                </tr>
            </tbody>
        </table>
        </div>
        <div className="history-records">
            <h5>History</h5>
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

    } />
   
  )
}

export default Wallet