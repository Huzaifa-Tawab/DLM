import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { db } from "../firebase";

function Test() {
  const uid = "4567845678456";
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const AgentRef = collection(db, "Agent");
    const q = query(AgentRef, where("ChildOf", "==", uid));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs.length);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  }
  return <div>Test</div>;
}

export default Test;
