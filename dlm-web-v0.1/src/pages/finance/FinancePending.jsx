import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import FinanceHeader from "../../components/header/FinanceHeader";
import { debounce, uniqueId } from "lodash";
import SideBar from "../../components/Sidebar/sidebar";
import { onAuthStateChanged } from "firebase/auth";

function FinancePending() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [FinanceData, setFinanceData] = useState({});
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  let invoiceId = "";
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(uid);
        getFinanceUser(uid);
      } else {
        navigate("/login");
      }
    });
    getCustomersData();
  }, [1]);
  async function getFinanceUser(id) {
    const docRef = doc(db, "Users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setFinanceData(docSnap.data());
    } else {
      navigate("/login");
    }
  }
  async function AproveTrans(id, nature, data) {
    setisLoading(true);

    invoiceId = id;
    if (nature === "transfer") {
      const senderPending = doc(db, "Customers", data.senderCustomerID);
      const receiverPending = doc(db, "Customers", data.receiverCustomerID);

      await updateDoc(senderPending, {
        Plots: arrayRemove(data.fileNumber),
      });

      await updateDoc(receiverPending, {
        Plots: arrayUnion(data.fileNumber),
      });
    }

    // Calculate commissions
    const levelOneCommission = data.payment * 0.1;
    const otherLevelCommission = levelOneCommission * 0.1;

    // Retrieve the ChildOf for level 1
    const level1DocRef = doc(db, "Agent", data.agentID);
    const level1DocSnap = await getDoc(level1DocRef);
    // Update main person (level 1) credits
    await updateCredits(
      data.agentID,
      level1DocSnap.data().credit ?? 0,
      levelOneCommission,
      "Direct"
    );

    let level2id = null;
    if (level1DocSnap.exists()) {
      level2id = level1DocSnap.data()["ChildOf"];
    }
    if (level2id) {
      console.log(level2id);
      // Retrieve the ChildOf for level 2
      const level2DocRef = doc(db, "Agent", level2id);
      const level2DocSnap = await getDoc(level2DocRef);

      // Update next level (level 2) credits
      await updateCredits(
        level2id,
        level2DocSnap.data().credit ?? 0,
        otherLevelCommission,
        "Level2"
      );

      let level3id = null;
      if (level2DocSnap.exists()) {
        level3id = level2DocSnap.data()["ChildOf"];
      }

      if (level3id) {
        console.log(level3id);

        const level3DocRef = doc(db, "Agent", level3id);
        const level3DocSnap = await getDoc(level3DocRef);
        // Update next level (level 3) credits
        await updateCredits(
          level3id,
          level3DocSnap.data().credit ?? 0,
          otherLevelCommission,
          "Level3"
        );

        // Repeat the process for level 4 if needed

        let level4id = null;
        if (level3DocSnap.exists()) {
          level4id = level3DocSnap.data()["ChildOf"];
        }

        if (level4id) {
          console.log(level3id);

          const level4DocRef = doc(db, "Agent", level4id);
          const level4DocSnap = await getDoc(level4DocRef);
          // Update next level (level 3) credits
          await updateCredits(
            level4id,
            level4DocSnap.data().credit ?? 0,
            otherLevelCommission,
            "Level4"
          );

          // Repeat the process for level 5 if needed

          let level5id = null;
          if (level4DocSnap.exists()) {
            level5id = level4DocSnap.data()["ChildOf"];
          }

          if (level5id) {
            console.log(level4id);

            const level5DocRef = doc(db, "Agent", level5id);
            const level5DocSnap = await getDoc(level5DocRef);
            // Update next level (level 3) credits
            await updateCredits(
              level5id,
              level5DocSnap.data().credit ?? 0,
              otherLevelCommission,
              "Level5"
            );
          }
        }
      }
    }

    // Update transaction status to verified
    const transactionDoc = doc(db, "Transactions", id);
    await updateDoc(transactionDoc, {
      verifiedBy: FinanceData.Name,
      varified: true,
    });

    // Refresh customer data after the update
    getCustomersData();
    setisLoading(false);
  }

  async function updateCredits(agentId, credit, commission, level) {
    if (agentId) {
      console.log(agentId, credit, commission, level);
      const agentDoc = doc(db, "Agent", agentId);
      await updateDoc(agentDoc, {
        credit: credit + commission,
      }).then((e) => {
        console.log(e);
      });
      await addDoc(collection(db, "Credit"), {
        invoiceID: invoiceId,
        agent: agentId,
        level: level,
        commission: commission,
        created: serverTimestamp(),
      });
    }
  }

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Transactions"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      if (!doc.data()["varified"]) {
        newCustomersData.push(doc.data());
      }
    });
    setCustomersData(newCustomersData);
    setFilteredCustomersData(newCustomersData);
    setisLoading(false);
  }

  const filterData = useCallback(
    (searchText) => {
      let newData = CustomersData;
      if (searchText && searchText.length > 0) {
        newData = CustomersData.filter(
          (data) =>
            data.agentName.toLowerCase().includes(searchText.toLowerCase()) ||
            data.customerName
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            data.fileNumber.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      setFilteredCustomersData(newData);
    },
    [CustomersData]
  );

  const debouncedFilterData = useMemo(
    () => debounce(filterData, 300),
    [filterData]
  );

  const filteredCustomersDataMemoized = useMemo(
    () => filteredCustomersData,
    [filteredCustomersData]
  );

  function getDate(seconds) {
    let date = new Date(seconds * 1000);
    let temp = date.toLocaleDateString();
    return temp;
  }

  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="Admin-Home">
              <div className="Admin-Home-content">
                <div className="Admin-Home-table">
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => debouncedFilterData(e.target.value)}
                    className="input-field"
                  />
                  <div className="table">
                    <table className="adminhome-table">
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Uploaded By</th>
                          <th>File Number</th>
                          <th>Nature</th>
                          <th>Payment</th>
                          <th>penalty</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomersDataMemoized.map((e, index) => (
                          <tr key={index}>
                            <td>{e.customerName}</td>
                            <td>{e.agentName}</td>
                            <td>{e.fileNumber}</td>
                            <td>{e.nature}</td>
                            <td>{e.payment}</td>
                            <td>{e.panelty}</td>
                            <td>{getDate(e.time.seconds)}</td>

                            <td>
                              <button
                                className="button-view"
                                onClick={() => {
                                  openNewWindow(e.proof);
                                }}
                              >
                                View
                              </button>
                              <button
                                className="button-view"
                                onClick={() => {
                                  AproveTrans(e.InvId, e.nature, e);
                                }}
                              >
                                Approve
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* Add any additional components or content here */}
          </>
        )
      }
    />
  );
}

export default FinancePending;
