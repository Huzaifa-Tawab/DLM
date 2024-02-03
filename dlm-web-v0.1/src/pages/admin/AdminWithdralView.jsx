import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { debounce } from "lodash";

import SideBar from "../../components/Sidebar/sidebar";

// import "./buttonswithdrwatable.css";

function AdminWithdralView() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getCustomersData();
  }, []);
  const openNewWindow = (Link) => {
    // Open a new window
    const newWindow = window.open("", "_blank");

    // Navigate to the specified URL in the new window
    newWindow.location.href = Link;
  };

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "WithDraw"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      let x = doc.data();
      x["id"] = doc.id;
      newCustomersData.push(x);
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
            data.Name.toLowerCase().includes(searchText.toLowerCase()) ||
            data.agentid.toLowerCase().includes(searchText.toLowerCase())
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
    let temp = date.toLocaleTimeString() + " " + date.toLocaleDateString();

    return temp;
  }
  const filterBasedOnStatusDropdown = (searchValue) => {
    let newList = [];
    if (searchValue == "All") {
      newList = CustomersData;
    } else {
      if (searchValue) {
        CustomersData.forEach((customer) => {
          if (
            customer &&
            customer.status.toLowerCase() == searchValue.toLowerCase()
          ) {
            newList.push(customer);
          }
        });
      }
    }

    setFilteredCustomersData(newList);
  };
  return (
    <>
      <SideBar
        element={
          isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="Admin-Home">
                <div className="hero--head">
                  <h1>Withdrawal Details</h1>
                </div>
                <select
                  onChange={(e) => {
                    filterBasedOnStatusDropdown(e.target.value);
                  }}
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>
                <div className="Admin-Home-content">
                  <div className="Admin-Home-table">
                    <form class="nosubmit">
                      <input
                        class="nosubmit"
                        type="search"
                        placeholder="Search by Id"
                        onChange={(e) => debouncedFilterData(e.target.value)}
                      />
                    </form>
                    <div className="table-wrapper">
                      <table className="fl-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Cnic</th>
                            <th>Cheque Of</th>
                            <th>Cheque Number</th>
                            <th>Requsted/Approved at</th>
                            <th>Requested Amount</th>
                            <th>Approved Amount</th>
                            <th>Status</th>
                            <th>Proof</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomersDataMemoized.map((e, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{e.Name}</td>
                              <td>{e.agentid}</td>
                              <td>{e.chequeOf ? e.chequeOf : "None"}</td>
                              <td>{e.chequeNo ? e.chequeNo : "None"}</td>
                              <td>{getDate(e.created.seconds)}</td>
                              <td>{e.amount}</td>
                              <td>{e.AmountApproved}</td>
                              <td>{e.status}</td>
                              <td>
                                <button
                                  className="button-viewwwer"
                                  onClick={() => {
                                    if (e.Proof) {
                                      openNewWindow(`${e.Proof}`);
                                    } else {
                                      alert("Withdraw is in Pending State");
                                    }
                                  }}
                                >
                                  View Proof
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
            </>
          )
        }
      />
    </>
  );
}

export default AdminWithdralView;
