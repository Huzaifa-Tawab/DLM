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

  const navigate = useNavigate();
  useEffect(() => {
    if ((isLogedIn()&&isAdmin())&& !isFinance()){
    getUser();
    getListText();

    // getPromos();
    // getPayments();
    getStats();
    }else{
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
                  <div className="agent-dash-content-col1-row1">
                    <img src={User.img} className="dash-avatar" />
                    <div className="inf--flex-col">
                    <span><strong className="strong">Name:</strong>{User.Name}</span>

                    </div>
                  </div>

                  <div className="agent-dash-content-col1-row2">
                    <div className="agent-dash-content-col1-row2-card1">
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
                    <div className="agent-dash-content-col1-row2-card2">
                      <h4>Files Details</h4>
                      <p> Total {NoPlots} Plots </p>
                      <p>DynamicLandManagement {dynamicLandManagement}</p>
                      <p>sydneyHawks7 {sydneyHawks7}</p>
                      <p>newCityParadise {newCityParadise}</p>
                      <p>Unknown {UnKnowSociety}</p>
                    </div>
                  </div>
                </div>
                <div className="agent-dash-content-col2">
                  {PromosWithStatus &&
                    PromosWithStatus.map((promo, index) => (
                      // promo.status === "completed" ? "goal-achieved" : ""

                      <div
                        key={index}
                        className={`agent-dash-content-col2-card ${
                          promo.status === "completed" ? "goal-achieved" : ""
                        }`}
                      >
                        <div className="mymistake-huxi">
                          <div className="agent-dash-content-col2-card-content">
                            <h1>{promo.title}</h1>
                            <h3>Pts :{promo.totalAmount}</h3>
                            <h3>Target :{promo.target}</h3>
                          </div>
                          <div className="agent-dash-content-col2-card-progress">
                            <CircularProgressbar
                              className="progress-percent"
                              value={parseInt(promo.per)}
                              text={`${parseInt(promo.per)}%`}
                            />
                          </div>
                        </div>
                        <div className="flex-justify">
                          <h3>Prize:{promo.prize}</h3>
                          <h3>
                            {calculateRemainingHours(promo.endsAt.toDate())}hrs
                            left
                          </h3>
                        </div>
                      </div>
                    ))}
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
