import React, { useState, useEffect } from "react";
import SideBar from "../../components/Sidebar/sidebar";
import "./financedash.css"; // Import your CSS file for styling
import Loader from "../../components/loader/Loader";
import CommingSoon from "../Commingsoon";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

function FinanceDash() {
  const [isLoading, setisLoading] = useState(true);
  const [Marquee, setMarquee] = useState("");
  useEffect(() => {
    getListText();
    setisLoading(false);
  }, []);

  const getListText = async () => {
    const docRef = doc(db, "constraints", "Super");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMarquee(docSnap.data().Marquee.join(" | "));
      console.log(docSnap.data().Marquee);
    }
  };

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
                <div className="financeDash-Details">
                  Name:
                  <br />
                  Cnic: <br />
                  Email: <br />
                  Address:
                </div>
                <div className="financeDash-stats"></div>
              </div>
              <div className="financeDash-Bottom">
                <div className="financeDash-Bottom-card"></div>
                <div className="financeDash-Bottom-card">
                  <p>Dynamic Land Management</p>
                </div>
                <div className="financeDash-Bottom-card">
                  <p>Sydney Hawks 7</p>
                </div>
                <div className="financeDash-Bottom-card">
                  <p>Unknown</p>
                </div>
              </div>
            </div>
          </>
        )
      }
    />
  );
}

export default FinanceDash;
