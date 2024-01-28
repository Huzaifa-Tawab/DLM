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
import { auth, db } from "../firebase";
import SideBar from "../components/Sidebar/sidebar";
import "./test.css"; // Import your CSS file for styling
import { onAuthStateChanged } from "firebase/auth";
import { Loader } from "rsuite";

function Test() {
  const [LevelOne, setLevelOne] = useState([]);
  const [LevelTwo, setLevelTwo] = useState([]);
  const [LevelThree, setLevelThree] = useState([]);
  const [LevelFour, setLevelFour] = useState([]);
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

        const isGoalAchieved = totalAmount >= promoData.target;

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
        };
      })
    );

    setPromosWithStatus(promosWithStatus);
  }

  useEffect(() => {
    getPromosWithStatus();
  }, []);

  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="agent-dash">
              <div className="news-slider">
                <marquee
                  className="promo"
                  behavior="scroll"
                  scrollamount="10"
                  width="100%"
                  direction="right"
                  height="50px"
                >
                  {Marquee}
                </marquee>
                <div className="dash-main-set">
                  <div className="client-pic">
                    <div className="client-pic-detail">
                      <img
                        className="avatar"
                        src={User.imgUrl}
                        alt="User"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ maxWidth: "100px" }}
                      />
                      <div className="cus-details">
                        <h2>{User.Name}</h2>
                        <h2>{User.Dob}</h2>
                        <h2>{User.Cnic}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="level-cards">
                    <div className="box-level-record">
                      <h2>Level 1</h2>
                      {LevelOne.length}
                    </div>
                    <div className="box-level-record">
                      <h2>Level 2</h2>
                      {LevelTwo.length}
                    </div>
                    <div className="box-level-record">
                      <h2>Level 3</h2>
                      {LevelThree.length}
                    </div>
                    <div className="box-level-record">
                      <h2>Level 4</h2>
                      {LevelFour.length}
                    </div>
                  </div>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Prize</th>
                    <th>Target</th>
                    <th>Ends At</th>
                    <th>Remaining Hours</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PromosWithStatus.map((promo, index) => (
                    <tr
                      key={index}
                      className={
                        promo.status === "completed" ? "goal-achieved" : ""
                      }
                    >
                      <td>{promo.title}</td>
                      <td>{promo.prize}</td>
                      <td>{promo.target}</td>
                      <td>{promo.endsAt.toDate().toLocaleString()}</td>
                      <td>{calculateRemainingHours(promo.endsAt.toDate())}</td>
                      <td>{promo.totalAmount}</td>
                      <td>{promo.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {User && <></>}
            </div>
            <li>
              <strong>Plots:</strong> {User.Plots.length}
            </li>
          </>
        )
      }
    />
  );
}

export default Test;
