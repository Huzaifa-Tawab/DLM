import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import SideBar from "../components/Sidebar/sidebar";

function Test() {
  const [LevelOne, setLevelOne] = useState([]);
  const [LevelTwo, setLevelTwo] = useState([]);
  const [LevelThree, setLevelThree] = useState([]);
  const [LevelFour, setLevelFour] = useState([]);
  const [User, setUser] = useState();
  const uid = "4567845678456";

  useEffect(() => {
    getUser();
    fetchData(uid);
  }, []);

  const getUser = async () => {
    const docRef = doc(db, "Agent", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data());
    }
  };

  const fetchData = async (user) => {
    const AgentRef = collection(db, "Agent");

    // Level 1
    const level1Query = query(AgentRef, where("ChildOf", "==", user));
    const level1Snapshot = await getDocs(level1Query);
    setLevelOne(level1Snapshot.docs.map((doc) => doc.data()));

    // Level 2
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

    // Level 3
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

    // Level 4
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

  return (
    <SideBar
      element={
        <>
          <div>
            <h2>Level 1</h2>
            {LevelOne.map((user, index) => (
              <div key={index}>{user.Cnic}</div>
            ))}

            <h2>Level 2</h2>
            {LevelTwo.map((user, index) => (
              <div key={index}>{user.Cnic}</div>
            ))}

            <h2>Level 3</h2>
            {LevelThree.map((user, index) => (
              <div key={index}>{user.Cnic}</div>
            ))}

            <h2>Level 4</h2>
            {LevelFour.map((user, index) => (
              <div key={index}>{user.Cnic}</div>
            ))}
            {User && (
              <>
                <p>{User.Name}</p>
                <p>{User.InvId}</p>
              </>
            )}
          </div>
        </>
      }
    />
  );
}

export default Test;
