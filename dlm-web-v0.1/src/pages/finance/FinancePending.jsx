import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import { debounce } from "lodash";
import FinanceHeader from "../../components/header/FinanceHeader";

function FinancePending() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getCustomersData();
  }, []);
  async function AproveTrans(id, nature, data) {
    setisLoading(true);
    console.log(id);
    if (nature == "transfer") {
      const Pending = doc(db, "Customers", data.senderCustomerID);

      await updateDoc(Pending, {
        Plots: arrayRemove(data.fileNumber),
      }).then(async (e) => {
        const Pending = doc(db, "Customers", data.receiverCustomerID);

        await updateDoc(Pending, {
          Plots: arrayUnion(data.fileNumber),
        }).then((e) => {});
      });
    }
    const levelOneCommission = data.payment * 0.1;
    const otherLevelCommission = levelOneCommission * 0.1;
    await updateDoc(doc(db, "Agent", data.AgentId), {
      credit: "this will",
    });

    const Pending = doc(db, "Transactions", id);

    await updateDoc(Pending, {
      varified: true,
    }).then(async (e) => {
      getCustomersData();
      setisLoading(false);
    });
  }

  const openNewWindow = (Link) => {
    // Open a new window
    const newWindow = window.open("", "_blank");

    // Navigate to the specified URL in the new window
    newWindow.location.href = Link;
  };
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
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <FinanceHeader />
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
                            // console.log(e.InvId, e.nature, e);
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
      <Footer />
    </>
  );
}

export default FinancePending;
