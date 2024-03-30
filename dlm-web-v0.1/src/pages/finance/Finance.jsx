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
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);

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
            data.fileNumber.toLowerCase().includes(searchText.toLowerCase()) ||
            data.verifiedBy.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      let _total = 0;
      newData.forEach((e) => {
        // console.log(parseInt(e.total) || 0);
        _total = _total + parseInt(e.total) || 0;
      });
      // console.log(_total);
      setTotal(_total);
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
  //delte these lines after eid so the calender range will work
  const onDateSelect = (e) => {
    filteredBasedOnDate(e.target.value);
  };
  const filteredBasedOnDate = (value) => {
    console.log(value);
    let list = [];
    let int = 0;
    let selectedMonth = null;
    let selectedYear = null;
    let selectedDay = null;
    if (value) {
      let selectedDate = value.split("-");
      selectedDay = selectedDate[2];
      selectedMonth = selectedDate[1];
      selectedYear = selectedDate[0];
      CustomersData.forEach((customer) => {
        if (customer.time.seconds) {
          let date = getDate(customer.time.seconds);
          console.log("----");
          console.log(date);
          let splitDate = date.split("/");
          let month = splitDate[0];
          if (month.length == 1) {
            month = 0 + month;
          }
          if (
            splitDate[2] == selectedYear &&
            month == selectedMonth &&
            splitDate[1] == selectedDay //upto here

            //uncommit these lines

            // const filteredBasedOnDate = (startDate, endDate) => {
            //   let list = [];
            //   let int = 0;
            //   let startedMonth = null;
            //   let endingMonth = null;
            //   let startedYear = null;
            //   let endingYear = null;
            //   let startedDay = null;
            //   let endingDay = null;

            //   if (startDate && endDate) {
            //     let startedDate = startDate.split("-");
            //     startedDay = startedDate[2];
            //     startedMonth = startedDate[1];
            //     startedYear = startedDate[0];
            //     let endingDate = endDate.split("-");
            //     endingDay = endingDate[2];
            //     endingMonth = endingDate[1];
            //     endingYear = endingDate[0];
            //     CustomersData.forEach((customer) => {
            //       if (customer.time.seconds) {
            //         let sDate = getDate(customer.time.seconds);

            //         console.log(sDate);
            //         let splitDate = sDate.split("/");
            //         let month = splitDate[0];
            //         let day = splitDate[1];
            //         let year = splitDate[2];

            //         if (month.length == 1) {
            //           month = 0 + month;
            //         }
            //         console.log(startDate);
            //         console.log(endDate);
            //         if (
            //           year >= startedYear &&
            //           month >= startedMonth &&
            //           day >= startedDay &&
            //           year <= endingYear &&
            //           month <= endingMonth &&
            //           day <= endingDay
          ) {
            int = parseInt(customer.total) + int;
            list.push(customer);
          }
        }
      });
      setFilteredCustomersData(list);
      setTotal(int);
    } else {
      setFilteredCustomersData(CustomersData);
      setTotal(0);
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
                <h1>Invoices</h1>
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
                      onChange={(e) => debouncedFilterData(e.target.value)}
                    />
                    {/* uncomit these calenders for range calender search */}
                    {/* <input
                      className="calender"
                      type="date"
                      name="Start date"
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        filteredBasedOnDate(e.target.value, endDate);
                      }}
                    />
                    <input
                      className="calender"
                      type="date"
                      name="end date"
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        filteredBasedOnDate(startDate, e.target.value);
                      }}
                    /> */}

                    {/* delete this calender after eid */}
                    <input
                      className="calender"
                      type="date"
                      name="Select date"
                      onChange={onDateSelect}
                    />
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
