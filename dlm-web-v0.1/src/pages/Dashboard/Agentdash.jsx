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

function AgentDash() {
  const [LevelOne, setLevelOne] = useState([]);
  const [LevelTwo, setLevelTwo] = useState([]);
  const [LevelThree, setLevelThree] = useState([]);
  const [LevelFour, setLevelFour] = useState([]);
  const [LevelFive, setLevelFive] = useState([]);
  const [ChildOf, setChildOf] = useState({});
  const [Promos, setPromos] = useState([]);
  const [Marquee, setMarquee] = useState("");
  const [User, setUser] = useState();
  const [PromosWithStatus, setPromosWithStatus] = useState([]);
  const [uid, setuid] = useState("");
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getUser();
    getListText();
    getPromos();
    getPayments();
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
        setuid(user.uid);
        const docRef = doc(db, "Agent", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          fetchData(user.uid);
          const childRef = doc(db, "Agent", docSnap.data().ChildOf);
          const childSnap = await getDoc(childRef);
          if (childSnap.exists()) {
            setChildOf(childSnap.data());
          }
        }
      } else {
        // User is signed out
        // ...
      }
    });
  };

  const fetchData = async (user) => {
    const AgentRef = collection(db, "Agent");

    const level1Query = query(AgentRef, where("ChildOf", "==", user));
    const level1Snapshot = await getDocs(level1Query);
    setLevelOne(level1Snapshot.docs.map((doc) => doc.data()));
    setisLoading(false);

    const level2Query = query(
      AgentRef,
      where(
        "ChildOf",
        "in",
        level1Snapshot.docs.map((doc) => doc.id)
      )
    );
    const level2Snapshot = await getDocs(level2Query);
    setLevelTwo(level2Snapshot.docs.map((doc) => doc.data()));

    const level3Query = query(
      AgentRef,
      where(
        "ChildOf",
        "in",
        level2Snapshot.docs.map((doc) => doc.id)
      )
    );
    const level3Snapshot = await getDocs(level3Query);
    setLevelThree(level3Snapshot.docs.map((doc) => doc.data()));

    const level4Query = query(
      AgentRef,
      where(
        "ChildOf",
        "in",
        level3Snapshot.docs.map((doc) => doc.id)
      )
    );
    const level4Snapshot = await getDocs(level4Query);
    setLevelFour(level4Snapshot.docs.map((doc) => doc.data()));
    console.log(LevelFour);
    const level5Query = query(
      AgentRef,
      where(
        "ChildOf",
        "in",
        level4Snapshot.docs.map((doc) => doc.id)
      )
    );
    const level5Snapshot = await getDocs(level5Query);
    setLevelFive(level5Snapshot.docs.map((doc) => doc.data()));
    console.log(level5Snapshot.docs.map((doc) => doc.data()));
  };

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

  async function getPromosWithStatus() {
    const currentTimestamp = Timestamp.fromDate(new Date());

    const promoQuery = query(
      collection(db, "Promos"),
      where("endsAt", ">", currentTimestamp)
    );
    const promoSnapshot = await getDocs(promoQuery);

    const promosWithStatus = await Promise.all(
      promoSnapshot.docs.map(async (promoDoc) => {
        const promoData = promoDoc.data();
        const promoCreatedAt = promoData.createdAt;

        const transactionsQuery = query(
          collection(db, "Transactions"),
          where("varified", "==", true),
          where("agentID", "==", uid),
          where("time", ">", promoCreatedAt)
        );

        const transactionsSnapshot = await getDocs(transactionsQuery);

        const totalAmount = transactionsSnapshot.docs.reduce(
          (sum, transactionDoc) =>
            sum + parseInt(transactionDoc.data().total, 10),
          0
        );
        console.log(totalAmount);
        const isGoalAchieved = totalAmount >= promoData.target;
        const per = (totalAmount / promoData.target) * 100;
        const status = isGoalAchieved ? "completed" : "pending";

        if (isGoalAchieved) {
          await addDoc(collection(db, "CompletedPromos"), {
            agentID: uid,
            promoID: promoDoc.id,
            // Add other relevant data
          });
        }

        return {
          ...promoData,
          totalAmount,
          status,
          per,
        };
      })
    );

    setPromosWithStatus(promosWithStatus);
  }

  useEffect(() => {
    if (Promos) {
      getPromosWithStatus();
    }
  }, [Promos]);

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
                    <h3>AGENT PROFILE</h3>
                  </div>
                  <div className="agent-dash-content-col1-row1 light-blue" >
                    <img src={User.imgUrl} className="dash-avatar" />
                    <div className="rower-fle">
                    <div className="rower">
                      <span><strong className="strong">Name:</strong></span>
                      <span><strong className="strong" >Gender:</strong></span>
                      <span><strong className="strong">CNIC:</strong></span>
                      <span><strong className="strong">Invoice Id:</strong> </span>
                      <span><strong className="strong">Sponsor of:</strong></span>
                    </div>
                    <div className="rower">
                      <span>{User.Name}</span>
                      <span>{User.Gender}</span>
                      <span>{User.Cnic}</span>
                      <span>{ChildOf.InvId}</span>
                      <span>{ChildOf.Name}</span>
                    </div>
                    <div className="rower">
                      <span><strong className="strong">F/H Name:</strong></span>
                      <span><strong className="strong">D.O.B:</strong></span>
                      <span><strong className="strong">Phone No:</strong></span>
                      <span><strong className="strong">TownCity:</strong></span>
                    </div>
                    <div className="rower">
                      <span>{User.FName}</span>
                      <span>{User.Dob}</span>
                      <span>{ChildOf.phNo}</span>
                      <span>{ChildOf.TownCity}</span>
                    </div>
                  </div>
                  </div>

                  <div className="agent-dash-content-col1-row2">
                    <div className="agent-dash-content-col1-row2-card1">
                    <h4>User Details</h4>
                      <div className="level-card">
                        <h1>Direct </h1>
                        <h1>{User.Plots.length} plots </h1>
                      </div>
                      <div className="level-card">
                        <h1>Level 1 </h1>
                        <h1>{LevelOne.length} persons </h1>
                      </div>
                      <div className="level-card">
                        <h1>Level 2 </h1>
                        <h1>{LevelTwo.length} persons </h1>
                      </div>
                      <div className="level-card">
                        <h1>Level 3 </h1>
                        <h1>{LevelThree.length} persons </h1>
                      </div>
                      <div className="level-card">
                        <h1>Level 4 </h1>
                        <h1>{LevelFive.length} persons </h1>
                      </div>
                    </div>
                    <div className="agent-dash-content-col1-row2-card2">
                    <h4>Files Details</h4>
                    <div className="level-card">
                        <h1>Plots </h1>
                        </div>
                      <ul >
                        {User.Plots.lenght === 0 ? (
                          <p>NO Plots</p>
                        ) : (
                          User.Plots.map((e) => <li>{e}</li>)

                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="agent-dash-content-col2 light-green">
                  {PromosWithStatus &&
                    PromosWithStatus.map((promo, index) => (
                      //     promo.status === "completed" ? "goal-achieved" : ""

                      <div
                        key={index}
                        className={`agent-dash-content-col2-card ${promo.status === "completed" ? "goal-achieved" : ""
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

export default AgentDash;
