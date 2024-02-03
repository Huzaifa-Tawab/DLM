import React, { useEffect, useState } from "react";
import "./wallet.css";
import SideBar from "../../components/Sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import isAdmin from "../../../IsAdmin";
import arrow from "../../Assets/Plus.png";
import Widrawal from "../../components/Modals/widrawal";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import GetAgent from "../../getagent";
import { onAuthStateChanged } from "firebase/auth";
import getDate from "../../../GetDDMMYY";
import avatarpic from "../../Assets/avatar.png";

function Wallet() {
  const [ShowWidrawalModal, setShowWidrawalModal] = useState(false);
  const [TotalCredit, setTotalCredit] = useState(0);
  const [TotalWithDraw, setTotalWithDraw] = useState(0);
  const [CreditList, setCreditList] = useState([]);
  const [WithdrawList, setWithdrawList] = useState([]);
  const [userData, setuserData] = useState({});
  const [uid, setuid] = useState("");
  const [totalDirect, settotalDirect] = useState(0);
  const [totalLevel2, settotalLevel2] = useState(0);
  const [totalLevel3, settotalLevel3] = useState(0);
  const [totalLevel4, settotalLevel4] = useState(0);
  const [totalLevel5, settotalLevel5] = useState(0);

  useEffect(() => {
    getUserData();
  }, []);

  const openWidrawalModal = () => {
    setShowWidrawalModal(true);
  };

  const closeWidarawalModal = () => {
    setShowWidrawalModal(false);
  };
  async function getWithdrawRecord(uid) {
    const q = query(collection(db, "WithDraw"), where("agentid", "==", uid));
    const querySnapshot = await getDocs(q);
    let total = 0;
    let temp = [];
    querySnapshot.forEach((doc) => {
      total += parseInt(doc.data().amount);
      console.log(doc.data());
      temp.push(doc.data());
    });
    setWithdrawList(temp);
    setTotalWithDraw(total);
  }
  async function getUserData() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
        setuid(uid);
        const docRef = doc(db, "Agent", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setuserData(docSnap.data());
          getWithdrawRecord(uid);
          getCreditRecord(uid);
        }
      }
    });
  }
  async function getCreditRecord(uid) {
    const q = query(collection(db, "Credit"), where("agent", "==", uid));
    const querySnapshot = await getDocs(q);
    let temp = [];
    let total = 0;
    let direct = 0;
    let lvl2 = 0;
    let lvl3 = 0;
    let lvl4 = 0;
    let lvl5 = 0;
    querySnapshot.forEach((doc) => {
      total += parseInt(doc.data().commission);
      temp.push(doc.data());
      switch (doc.data().level) {
        case "Direct":
          direct += parseInt(doc.data().commission);
          break;
        case "Level2":
          lvl2 += parseInt(doc.data().commission);

          break;
        case "Level3":
          lvl3 += parseInt(doc.data().commission);

          break;
        case "Level4":
          lvl4 += parseInt(doc.data().commission);
          break;
        case "Level5":
          lvl5 += parseInt(doc.data().commission);
          break;

        default:
          break;
      }
    });
    setTotalCredit(total);
    settotalDirect(direct);
    settotalLevel2(lvl2);
    settotalLevel3(lvl3);
    settotalLevel4(lvl4);
    settotalLevel5(lvl5);
    setCreditList(temp);
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
            {/* <div className="amount-cards">
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
                      <span>{userData.credit}</span>
                    </div>
                    <br />
                    <div className="wallet-total-amount">
                      <h3>Widhrawal Amount</h3>
                      <span>{TotalWithDraw}</span>
                    </div>
                  </div>
                </div>
                <div className="wallet-box-head">
                  <h4>Direct Commision</h4>
                  <span>{totalDirect}</span>
                </div>
              </div>

              <div className="flex-cards-wallet-levels">
                <div className="wallet-box">
                  <h4>Level 1</h4>
                  <span>{totalLevel2}</span>
                </div>
                <div className="wallet-box">
                  <h4>Level 2</h4>
                  <span>{totalLevel3}</span>
                </div>
                <div className="wallet-box">
                  <h4>Level 3</h4>
                  <span>{totalLevel4}</span>
                </div>
                <div className="wallet-box">
                  <h4>Level 4</h4>
                  <span>{totalLevel5}</span>
                </div>
                <div className="wallet-box">
                  <h4>Level 5</h4>
                  <span>{totalLevel5}</span>
                </div>
              </div>
            </div> */}
           <div className="main--content">
            <div className="header--wrapper">
              <div className="header--title">
                <span>Primary</span>
                <h2>Dashboard</h2>
              </div>
              <div className="user--info">
                <div className="search--box">
                  <i className="fa-solid-fa-search"></i>
                  <input type="text"
                  placeholder="search"/>
                </div>
                <img src={avatarpic} alt=""/>
              </div>
            </div>
             <div className="card-----container">
              <h3 className="main-----title">Wallet Data</h3>
              <div className="card-----wrapper">
                <div className="payment-----card light-red">
                  <div className="card-----header">
                    <div className="amount">
                      <span className="title">Total Amount</span>
                      <span className="amount-value"> RS 1000000</span>
                    </div>
                    <i className="fas fa-rupee-sign iconer"></i>

                  </div>
                  {/* <span className="card-----detail">****** *** 675</span> */}
                </div>

                <div className="payment-----card light-purple">
                  <div className="card-----header">
                    <div className="amount">
                      <span className="title">Remaining Amount</span>
                      <span className="amount-value"> RS 1000000</span>
                    </div>
                    <i className="fas fa-rupee-sign iconer dark-purple" ></i>

                  </div>
                  {/* <span className="card-----detail">****** *** 675</span> */}
                </div>

                <div className="payment-----card light-green">
                  <div className="card-----header">
                    <div className="amount">
                      <span className="title">Withdrawal</span>
                      <span className="amount-value"> RS 1000000</span>
                    </div>
                    <i className="fas fa-rupee-sign iconer dark-green"></i>

                  </div>
                  {/* <span className="card-----detail">****** *** 675</span> */}
                </div>

                <div className="payment-----card light-blue">
                  <div className="card-----header">
                    <div className="amount">
                      <span className="title">Direct Commision</span>
                      <span className="amount-value"> RS 1000000</span>
                    </div>
                    <i className="fas fa-rupee-sign iconer dark-blue"></i>

                  </div>
                  {/* <span className="card-----detail">****** *** 675</span> */}
                </div>
                
                
              </div>
             </div>
             <div className="card-----container">
             <h3 className="main-----title">Commision Levels</h3>
              <div className="levels-row">
                <div className="levelsflex">
                <h3>Level<span className="level-points">1</span></h3>
                <h1 className="points">10000</h1>
                </div>
                <div className="levelsflex">
                <h3>Level<span  className="level-points">2</span></h3>
                <h1 className="points">10000</h1>
                </div>
                <div className="levelsflex">
                <h3>Level<span  className="level-points">2</span></h3>
                <h1 className="points">10000</h1>
                </div>
                <div className="levelsflex">
                <h3>Level<span  className="level-points">2</span></h3>
                <h1 className="points">10000</h1>
                </div>
                <div className="levelsflex">
                <h3>Level<span  className="level-points">2</span></h3>
                <h1 className="points">10000</h1>
                </div>
              </div>
             </div>
            
            </div> 
            
            

            <div className="invoice-list">
              <div className="wallet-invoice">
                <h5>Credit List</h5>
                <table className="wallet-invoice-table">
                  <thead>
                    <tr>
                      <th>Invoice Id</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CreditList &&
                      CreditList.map((e) => (
                        <tr>
                          <td>{e.invoiceID}</td>
                          <td>{e.commission}</td>
                          <td>{getDate(e.created.seconds)}</td>
                          <td>{e.level}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="history-records">
                <h5>WithDrawal List</h5>
                <table className="wallet-history-table">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WithdrawList &&
                      WithdrawList.map((e) => (
                        <tr
                          className={
                            e.status == "Pending"
                              ? "withdraw-pending"
                              : e.status == "Completed"
                              ? "withdraw-completed"
                              : e.status == "Declined"
                              ? "withdraw-declined"
                              : ""
                          }
                        >
                          <td>{e.amount}</td>
                          <td>{getDate(e.created.seconds)}</td>
                          <td>{e.status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div></div>
            </div>
            <Widrawal
              showModal={ShowWidrawalModal}
              onClose={closeWidarawalModal}
              totalCredit={userData.credit}
              uid={uid}
              name={userData.Name}
            />
          </div>
        </>
      }
    />
  );
}

export default Wallet;
