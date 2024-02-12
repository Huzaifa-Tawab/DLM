import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import SideBar from "../../components/Sidebar/sidebar";
import "./dashboard.css"; // Import your CSS file for styling
import { onAuthStateChanged } from "firebase/auth";
import { CircularProgressbar } from "react-circular-progressbar";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import isLogedIn from "../../../isLogedIn";
import isAdmin from "../../../IsAdmin";
import isFinance from "../../../IsFinance";

function AdminDash() {
  const [NoPlots, setNoPlots] = useState("");
  const [NoCustomers, setNoCustomers] = useState("");
  const [NoTrans, setNoTrans] = useState("");
  const [NoAgent, setNoAgent] = useState("");
  const [Promos, setPromos] = useState([]);
  const [Marquee, setMarquee] = useState("");
  const [User, setUser] = useState();
  const [PromosWithStatus, setPromosWithStatus] = useState([]);
  const [uid, setuid] = useState("");
  const [isLoading, setisLoading] = useState(true);

  const [sydneyHawks7, setSydneyHawks7] = useState(0);
  const [newCityParadise, setNewCityParadise] = useState(0);
  const [dynamicLandManagement, setDynamicLandManagement] = useState(0);
  const [UnKnowSociety, setUnKnowSociety] = useState(0);
  const [PlotsWith10OrLessDaysLeft, setPlotsWith10OrLessDaysLeft] = useState(
    []
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (isLogedIn() && isAdmin() && !isFinance()) {
      getUser();
      getListText();

      // getPromos();
      // getPayments();
      getStats();
    } else {
      navigate("/login");
    }
  }, []);

  const getListText = async () => {
    const docRef = doc(db, "constraints", "Super");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMarquee(docSnap.data().Marquee.join(" | "));
    }
  };

  const getUser = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        console.log(user);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          console.log(docSnap.data());
          setisLoading(false);
        }
      } else {
        navigate("/login");
      }
    });
  };
  async function getStats() {
    const PlotsSnapshot = await getDocs(collection(db, "Plots"));
    setNoPlots(PlotsSnapshot.docs.length);
    let SydneyHawks7 = 0;
    let NewCityParadise = 0;
    let DynamicLandManagement = 0;
    let UnkownSociety = 0;
    PlotsSnapshot.docs.forEach((Plot) => {
      console.log(Plot.data().Society);
      if (Plot.data().Society === "Sydney Hawks 7") {
        SydneyHawks7++;
      } else if (Plot.data().Society === "Dynamic Land Management") {
        DynamicLandManagement++;
      } else if (Plot.data().Society === "New City Paradise") {
        NewCityParadise++;
      } else {
        UnkownSociety++;
      }
    });
    setSydneyHawks7(SydneyHawks7);
    setNewCityParadise(NewCityParadise);
    setDynamicLandManagement(DynamicLandManagement);
    setUnKnowSociety(UnkownSociety);

    const CustSnapshot = await getDocs(collection(db, "Customers"));
    setNoCustomers(CustSnapshot.docs.length);
    const TranSnapshot = await getDocs(collection(db, "Transactions"));
    setNoTrans(TranSnapshot.docs.length);
    const AgentSnapshot = await getDocs(collection(db, "Agent"));
    setNoAgent(AgentSnapshot.docs.length);
  }
  async function getPromos() {
    const currentTimestamp = Timestamp.fromDate(new Date());

    const q = query(
      collection(db, "Promos"),
      where("endsAt", ">", currentTimestamp)
    );

    const querySnapshot = await getDocs(q);
    let temp = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      temp.push(doc.data());
    });
    setPromos(temp);
  }

  const calculateRemainingHours = (endsAt) => {
    const currentTimestamp = new Date();
    const endsAtTimestamp = endsAt.getTime();
    const remainingHours = Math.floor(
      (endsAtTimestamp - currentTimestamp) / (1000 * 60 * 60)
    );

    return remainingHours;
  };

  async function getPayments() {
    const q = query(
      collection(db, "Transactions"),
      where("varified", "==", true),
      where("agentID", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    let temp = [];
    querySnapshot.forEach((doc) => {
      let map = {};
      map["time"] = doc.data().time.seconds;
      map["amount"] = parseInt(doc.data().total);
      temp.push(map);
    });
    console.log(temp);
  }
  useEffect(() => {
    fetchPlots();
  }, []);

  const hasPassedTwoMonths = (timestamp) => {
    const date = timestamp.toDate();
    const currentDate = new Date();

    currentDate.setMonth(currentDate.getMonth() - 2);
    currentDate.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    console.log(date < currentDate);
    console.log(date);
    console.log(currentDate);
    return date <= currentDate;
  };

  const fetchPlots = async () => {
    setPlotsWith10OrLessDaysLeft(null);
    try {
      const plotsSnapshot = await getDocs(collection(db, "Plots"));
      const plotsToUpdate = [];
      const plotsWithLessThan10DaysLeft = [];

      plotsSnapshot.forEach(async (doc) => {
        const lastPaymentTimestamp = doc.data().lastPayment;

        if (lastPaymentTimestamp) {
          // Convert lastPaymentTimestamp to a Date object
          const lastPaymentDate = new Date(lastPaymentTimestamp.toMillis());

          // Calculate the timestamp for 60 days ago
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

          // Calculate the number of days left
          let daysLeft = Math.floor(
            (sixtyDaysAgo.getTime() - lastPaymentDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          daysLeft = -daysLeft;
          console.log(
            `There are ${daysLeft} days left until lastPayment is 60 days old.`
          );

          if (hasPassedTwoMonths(lastPaymentTimestamp)) {
            await updatePlot(doc.id, { Blocked: true });
            plotsToUpdate.push(doc.id);
            console.log(`Document ${doc.id} has been updated: Blocked = true`);
          } else if (daysLeft <= 10 && daysLeft >= 0) {
            plotsWithLessThan10DaysLeft.push({
              id: doc.id,
              days: daysLeft,
            });
          }
        }
      });

      console.log("Plots to update: ", plotsToUpdate);
      console.log(
        "Plots with less than 10 days left: ",
        plotsWithLessThan10DaysLeft
      );
      setPlotsWith10OrLessDaysLeft(plotsWithLessThan10DaysLeft);
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  };

  const updatePlot = async (plotId, data) => {
    try {
      const plotRef = doc(db, "Plots", plotId);
      await updateDoc(plotRef, data);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="agent-dash">
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
              <div className="agent-dash-content">
                <div className="agent-dash-content-col1">
                  <div className="up-hd">
                    <h3>ADMIN PROFILE</h3>
                  </div>
                  <div className="agent-dash-content-col1-row1 light-blue">
                    <img src={User.img} className="dash-avatar" />
                    <div className="inf--flex-col">
                      <span>
                        <strong className="strong">Name:</strong>
                        {User.Name}
                      </span>
                    </div>
                  </div>

                  <div className="agent-dash-content-col1-row2">
                  
                    <div className="agent-dash-content-col1-row2-card1">
                    <h4>User Details</h4>
                      <div className="level-card">
                        <h1>Total Users </h1>
                        <h1>{NoCustomers + NoAgent} Users </h1>
                      </div>
                      <div className="level-card">
                        <h1>Customers </h1>
                        <h1>{NoCustomers} Customers </h1>
                      </div>
                      <div className="level-card">
                        <h1>Transactions</h1>
                        <h1>{NoTrans} Invoices </h1>
                      </div>
                      <div className="level-card">
                        <h1>Agents</h1>
                        <h1>{NoAgent} Agents </h1>
                      </div>
                    </div>
                    <div className="agent-dash-content-col1-row2-card2 ">
                      <h4>Files Details</h4>

                      <div className="level-card">
                        <h1> Total Plots </h1>
                        <h1>{NoPlots}</h1>
                      </div>
                      <div className="level-card">
                        <h1>DynamicLandManagement</h1>
                        <h1> {dynamicLandManagement}</h1>
                      </div>
                      <div className="level-card">
                        <h1>sydneyHawks7 </h1>
                        <h1>{sydneyHawks7}</h1>
                      </div>
                      <div className="level-card">
                        <h1>newCityParadise</h1>
                        <h1> {newCityParadise}</h1>
                      </div>
                      <div className="level-card">
                        <h1>Unknown </h1>
                        <h1>{UnKnowSociety}</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="agent-dash-content-col2 light-green">
                  <div className="admin-dash-daysleft-header">
                    
                    <h1>Near Due</h1>
                    <p>
                      {PlotsWith10OrLessDaysLeft &&
                        PlotsWith10OrLessDaysLeft.length + " Files"}
                    </p>
                    <button onClick={fetchPlots}className="refreshbutton"><i class="fa fa-refresh" aria-hidden="true"></i></button>
                   
                  </div>
                  {PlotsWith10OrLessDaysLeft ? (
                    PlotsWith10OrLessDaysLeft.map((Plot, index) => (
                      <div key={index}>
                        <div className="plotsdayleft-data">
                          <div className="data-data">
                          <p>{Plot.id}</p>
                          <p>{Plot.days} Days Left</p>
                          </div>
                          <div className="plotsdayleft-sec-data">
                          <button className="view-button"
                            onClick={() => {
                              navigate(`/details/plot/${Plot.id}`);
                            }}
                          >
                            {" "}
                            view{" "}
                          </button>
                          </div>
                        </div>
                        <div className="plotsdayleft-button">
                          
                        </div>
                      </div>
                    ))
                  ) : (
                    <Loader />
                  )}
                </div>
              </div>
            </div>
          </>
        )
      }
    />
  );
}

export default AdminDash;
