import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Test() {
  const [LevelOne, setLevelOne] = useState([]);
  const [LevelTwo, setLevelTwo] = useState([]);
  const [LevelThree, setLevelThree] = useState([]);
  const [LevelFour, setLevelFour] = useState([]);

  useEffect(() => {
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

    // Replace "yourUserId" with the actual user ID you want to start from
    const user = "4567845678456";
    fetchData(user);
  }, []); // Empty dependency array to ensure useEffect runs once on mount

  return (
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
    </div>
  );
}

export default Test;
