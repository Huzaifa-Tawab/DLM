import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const AgentRoutes = () => {
  const [Auth, setauth] = useState(false);
  const auth = getAuth();
  const uid = auth.currentUser.uid;

  useEffect(() => {
    getAuthFromFirebase();
  }, []);

  async function getAuthFromFirebase() {
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data().Type === "Agent" || docSnap.data().Type === "Admin") {
        setauth(true);
      }
    } else {
      console.log("No such document!");
    }
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default AgentRoutes;
