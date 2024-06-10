import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import { debounce } from "lodash";
import FinanceHeader from "../../components/header/FinanceHeader";
import arrow from "../../Assets/Plus.png";
import SideBar from "../../components/Sidebar/sidebar";
import { exportToExcel } from "../Print/exportToExcel";

function Finance() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState(null);

  const [approvedBy, setApprovedBy] = useState();

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
    const querySnapshot = await getDocs(collection(db, "Transactions"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()["varified"]) {
        newCustomersData.push(doc.data());
      }
    });
    setCustomersData(newCustomersData);
    setFilteredCustomersData(newCustomersData);
    let _total = 0;
    newCustomersData.forEach((e) => {
      _total = _total + parseInt(e.total) || 0;
    });
    setTotal(_total);
    setisLoading(false);
  }

  const filteredCustomersDataMemoized = useMemo(
    () => filteredCustomersData,
    [filteredCustomersData]
  );

  const filterData = (searchText, approvedBy, startDate, endDate) => {
    let newData = CustomersData;
    if (searchText && searchText.length > 0) {
      newData = newData.filter(
        (data) =>
          data.agentName.toLowerCase().includes(searchText.toLowerCase()) ||
          data.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          data.fileNumber.toLowerCase().includes(searchText.toLowerCase()) ||
          data.verifiedBy.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (approvedBy && approvedBy.length > 0 && approvedBy != "All") {
      newData = newData.filter((data) =>
        data.verifiedBy.toLowerCase().includes(approvedBy.toLowerCase())
      );
    }
    if (startDate && endDate) {
      newData = filteredBasedOnDate(startDate, endDate, newData);
    } else if (startDate) {
      newData = filteredBasedOnDate(startDate, null, newData);
    } else if (endDate) {
      newData = filteredBasedOnDate(null, endDate, newData);
    }
    let _total = 0;
    newData.forEach((e) => {
      if (e.total) {
        _total = _total + parseInt(e.total) || 0;
      }
    });
    setTotal(_total);
    setFilteredCustomersData(newData);
  };

  function getDate(seconds) {
    let date = new Date(seconds * 1000);
    let temp = date.toLocaleDateString();
    return temp;
  }

  const filteredBasedOnDate = (startDate, endDate, newData) => {
    let list = [];
    if (startDate && endDate) {
      let startedDate = new Date(startDate);
      let endingDate = new Date(endDate);
      newData.forEach((customer) => {
        if (customer.time.seconds) {
          let date = new Date(getDate(customer.time.seconds));
          if (date >= startedDate && date <= endingDate) {
            list.push(customer);
          }
        }
      });
      return list;
    } else if (startDate) {
      let startedDate = new Date(startDate);
      newData.forEach((customer) => {
        let date = new Date(getDate(customer.time.seconds));
        if (date >= startedDate) {
          list.push(customer);
        }
      });
      return list;
    } else if (endDate) {
      let endingDate = new Date(endDate);
      newData.forEach((customer) => {
        let date = new Date(getDate(customer.time.seconds));
        if (date <= endingDate) {
          list.push(customer);
        }
      });
      return list;
    }
  };
  function getDate(seconds) {
    let date = new Date(seconds * 1000);
    let temp = date.toLocaleDateString();

    return temp;
  }

  function downloadExcel() {
    exportToExcel(filteredCustomersDataMemoized, "invoices");
  }
  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="Admin-Home">
              <div className="hero--head">
                <h1>Invoices v1.0.0</h1>
                <h1>{filteredCustomersDataMemoized.length}</h1>
                <h1>{total} PKR</h1>
                <button onClick={downloadExcel}>Export</button>
              </div>
              <div className="Admin-Home-content">
                <div className="Admin-Home-table">
                  <form class="nosubmit alignment-cal-serch">
                    <input
                      class="nosubmit"
                      type="search"
                      placeholder="Search by Id"
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        filterData(
                          e.target.value,
                          approvedBy,
                          startDate,
                          endDate
                        );
                      }}
                    />
                    {/* uncomit these calenders for range calender search */}
                    <input
                      className="calender"
                      type="date"
                      name="Start date"
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        filterData(
                          searchText,
                          approvedBy,
                          e.target.value,
                          endDate
                        );
                      }}
                    />
                    <input
                      className="calender"
                      type="date"
                      name="end date"
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        filterData(
                          searchText,
                          approvedBy,
                          startDate,
                          e.target.value
                        );
                      }}
                    />

                    {/* delete this calender after eid */}
                    <select
                      className="Calender"
                      style={{
                        width: "200px",
                        display: "flex",
                        alignItems: "center",
                        height: "25px",
                        marginTop: "15px",
                        borderRadius: "8px",
                        padding: "3px",
                      }}
                      onChange={(e) => {
                        setApprovedBy(e.target.value);
                        filterData(
                          searchText,
                          e.target.value,
                          startDate,
                          endDate
                        );
                      }}
                    >
                      <option value="All">Choose Option</option>
                      <option value="Irfan Yousaf">Irfan Yousaf</option>
                      <option value="Hamza Sh"> Hamza Sh</option>
                    </select>
                  </form>

                  <div className="table-wrapper">
                    <table className="fl-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Uploaded By</th>
                          <th>File Number</th>
                          <th>Nature</th>
                          <th>Payment</th>
                          <th>penalty</th>
                          <th>Verified By</th>
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
                            <td>{e.verifiedBy}</td>
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
                                  // openNewWindow(e.InvId);
                                  openNewWindow(`/print/invoice/${e.InvId}`);
                                }}
                              >
                                Print
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
  );
}

export default Finance;
