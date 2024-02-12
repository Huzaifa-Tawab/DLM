import React, { useState, useEffect } from "react";
import SideBar from "../../components/Sidebar/sidebar";
import "./financedash.css"; // Import your CSS file for styling
import Loader from "../../components/loader/Loader";
import CommingSoon from "../Commingsoon";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function FinanceDash() {
  const [isLoading, setisLoading] = useState(true);
  const [Marquee, setMarquee] = useState("");
  const [SocietiesData, setSocietiesData] = useState();
  const [UserData, setUserData] = useState();
  const [NoOfVerifiedTrans, setNoOfVerifiedTrans] = useState(0);
  const [pendingInvoices, setpendingInvoices] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    getUser();
    getListText();

    setisLoading(false);
  }, []);
  function getUser() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());

          getSocietiesData(docSnap.data().Name);
        } else {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    });
  }
  const getListText = async () => {
    const docRef = doc(db, "constraints", "Super");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMarquee(docSnap.data().Marquee.join(" | "));
      console.log(docSnap.data().Marquee);
    }
  };
  async function getSocietiesData(name) {
    const societiesData0 = {
      "Dyanmic Land Management": { Amount: 0, Plots: 0, Blocked: 0 },
      "New City Paradise": { Amount: 0, Plots: 0, Blocked: 0 },
      "Sydney Hawks 7": { Amount: 0, Plots: 0, Blocked: 0 },
    };

    // Fetch Transactions data
    const transactionsQuerySnapshot = await getDocs(
      collection(db, "Transactions")
    );
    let noOfTrans = 0;
    let noOfUnVerifiedTrans = 0;
    transactionsQuerySnapshot.forEach((doc) => {
      const societyName = doc.data().Society;
      const payment = parseInt(doc.data().payment) || 0;

      if (societiesData0[societyName]) {
        societiesData0[societyName].Amount += payment;
      }
      if (doc.data().verifiedBy === name) {
        noOfTrans++;
      }
      if (!doc.data().varified) {
        noOfUnVerifiedTrans++;
      }
    });
    setpendingInvoices(noOfUnVerifiedTrans);
    setNoOfVerifiedTrans(noOfTrans);
    // Fetch Plots data
    const plotsQuerySnapshot = await getDocs(collection(db, "Plots"));
    plotsQuerySnapshot.forEach((doc) => {
      const societyName = doc.data().Society;
      const isBlocked = doc.data().Blocked || false;

      if (societiesData0[societyName]) {
        societiesData0[societyName].Plots++;
        societiesData0[societyName].Blocked += isBlocked ? 1 : 0;
      }
    });
    if (societiesData0) {
      setSocietiesData(societiesData0);
      console.log(SocietiesData);
    }
  }
  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <marquee
              className="news-slider"
              behavior="scroll"
              scrollamount="10"
              width="100%"
              direction="right"
              height="50px"
            >
              {Marquee}
            </marquee>
            <div className="financeDash">
              <div className="financeDash-aboutFinance">
                {UserData && (
                  <div className="financeDash-Details light-red ">
                    <img
                      src={UserData.img}
                      alt=""
                      width={"100px"}
                      height={"100px"}
                    />
                    <div className="about-col1">
                    <h3>Name:<span>{UserData.Name}</span></h3>
                    
                    <h3>Cnic:<span> {UserData.Cnic}</span></h3> 
                   <h3> Email:<span> {UserData.Email} </span></h3>

                    
                   <h3> Address:<span></span></h3>
                   <div className="sig-finance">
                   <h3> Digital Signature: </h3>
                   <img
                      src={UserData.signature}
                      width={"40px"}
                      height={"40px"}
                      alt=""
                    />
                    </div>
                    </div>
                  </div>
                )}
                <div className="financeDash-stats light-red">
                  <div className="bottom-cards-content">
                  <p>No Of Trans Approved py You</p>
                  <span>{NoOfVerifiedTrans}</span>
                  </div>
                  <div className="bottom-cards-content">
                  <p>Pending Invoices</p>
                  <span>{pendingInvoices}</span>
                  </div>
                  <p></p>
                </div>
              </div>
              <h3 className="societyHeading">Societies Stats</h3>

              {SocietiesData && (
                <div className="financeDash-Bottom">
                  <div className="financeDash-Bottom-card">
                    <h1>New City Paradise</h1>
                    <div className="bottom-cards-content">
                    <p>Number Of Plots:</p>
                    <span>{SocietiesData["New City Paradise"].Plots};</span>
                    </div>
                    <div className="bottom-cards-content">
                    <p>Blocked Plots:</p>
                    <span>{SocietiesData["New City Paradise"].blocked};</span>
                    </div>
                    <div className="bottom-cards-content">
                    <p>Amount Received:</p>
                    <span>{SocietiesData["New City Paradise"].Amount}</span>
                    </div>
                  </div>
                  <div className="financeDash-Bottom-card">
                    <h1>Dynamic Land Management</h1>
                    <div className="bottom-cards-content">
                    <p>Number Of Plots:</p>
                    <span>
                      {SocietiesData["Dyanmic Land Management"].Plots};
                    </span>
                    </div>
                    <div className="bottom-cards-content">
                    <p>Blocked Plots:</p>
                    <span>
                      {SocietiesData["Dyanmic Land Management"].blocked};
                    </span>
                    </div>
                    <div className="bottom-cards-content">
                    <p>Amount Received:</p>
                    <span>
                      {SocietiesData["Dyanmic Land Management"].Amount}
                    </span>
                    </div>
                  </div>
                  <div className="financeDash-Bottom-card">
                    <h1>Sydney Hawks 7</h1>
                    <div className="bottom-cards-content">
                    <p>Number Of Plots:</p>
                    <span>{SocietiesData["Sydney Hawks 7"].Plots};</span>
                    </div>
                    <div className="bottom-cards-content">
                    <p>Blocked Plots:</p>
                    <span>{SocietiesData["Sydney Hawks 7"].blocked};</span>
                    </div>
                    <div className="bottom-cards-content">
                    <p>Amount Received:</p>
                    <span>{SocietiesData["Sydney Hawks 7"].Amount}</span>
                    </div>
                  </div>
                  <div className="financeDash-Bottom-card">
                    <h1>Unknown</h1>
                  </div>
                </div>
              )}
            </div>
          </>
        )
      }
    />
  );
}

export default FinanceDash;
