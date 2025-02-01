import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import "./adminhome.css";
import avatar from "../../Assets/avatar.png";
import { debounce } from "lodash";
import arrow from "../../Assets/Plus.png";
import isAdmin from "../../../IsAdmin";
import { onAuthStateChanged } from "firebase/auth";
import SideBar from "../../components/Sidebar/sidebar";
import cnicFormat from "../../../cnicFormatter";
import * as XLSX from 'xlsx'; 

function AdminHome() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getCustomersData();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;

        console.log(user.uid);
        // ...
      } else {
        // User is signed out
        // ...
      }
      onAuthStateChanged();
    });
  }, []);

async function generateExcelSheet() {
   setisLoading(true)

    let data = [];  // To hold the data for the Excel sheet

    // Loop through each customer
    for (const cus of CustomersData) {
        // console.log(cus.Name, cus.FName, cus.Cnic, cus.phNo);

        // Loop through each plot of the customer
        for (const plot of cus.Plots) {
            const docRef = doc(db, "Plots", plot);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const plotData = docSnap.data();
                const row = {
                    CustomerName: cus.Name,
                    FatherName: cus.FName,
                    CNIC: cus.Cnic,
                    PhoneNumber: cus.phNo,
                    PlotID: plot,
                    TotalAmount: plotData.TotalAmount,
                    PaidAmount: plotData.paidAmount,
                    Remaining: (plotData.TotalAmount) - (plotData.paidAmount),

                };
                data.push(row);
            } else {
                console.log("No such plot document!");
            }
        }
    }

    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Plots");

    // Generate the Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the buffer and create a download link
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'customer_plots.xlsx';
    link.click(); // Trigger the download
    setisLoading(false); // Hide loading state after the download
}

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Customers"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      newCustomersData.push(doc.data());
    });
    if (isAdmin()) {
      setFilteredCustomersData(newCustomersData);
    } else {
      setFilteredCustomersData([]);
    }
    console.log(newCustomersData);
    setCustomersData(newCustomersData);
    setisLoading(false);
  }

  const filterData = useCallback(
    (searchText) => {
      let newData = CustomersData;
      if (searchText && searchText.length > 0) {
        if (isAdmin()) {
          newData = CustomersData.filter(
            (data) =>
              data.Name.toLowerCase().includes(searchText.toLowerCase()) ||
              data.Cnic.toLowerCase().includes(searchText.toLowerCase()) ||
              data.phNo.includes(searchText) ||
              data.Plots.some((plot) =>
                plot.toLowerCase().includes(searchText.toLowerCase())
              )
          );
        } else {
          newData = CustomersData.filter(
            (data) =>
              data.Name.toLowerCase() == searchText.toLowerCase() ||
              data.Cnic == searchText ||
              data.phNo == searchText ||
              data.Plots.some((plot) =>
                plot.toLowerCase().includes(searchText.toLowerCase())
              )
          );
        }
      } else {
        if (isAdmin()) {
          newData = CustomersData;
        } else {
          newData = [];
        }
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
  const onDateSelect = (e) => {
    filteredBasedOnDate(e.target.value);
  };
  const filteredBasedOnDate = (value) => {
    console.log(value);
    let list = [];
    let selectedMonth = null;
    let selectedYear = null;
    let selectedDay = null;
    if (value) {
      let selectedDate = value.split("-");
      selectedDay = selectedDate[2];
      selectedMonth = selectedDate[1];
      selectedYear = selectedDate[0];
      CustomersData.forEach((customer) => {
        if (customer.createdAt.seconds) {
          let date = getDate(customer.createdAt.seconds);
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
            splitDate[1] == selectedDay
          ) {
            list.push(customer);
          }
        }
      });
      setFilteredCustomersData(list);
    } else {
      setFilteredCustomersData(CustomersData);
    }
  };
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
              <div className="admin-show">{isAdmin() && "Admin"}</div>
              <div className="admin-show">
                {isAdmin() ? "Admin" : "SubAdmin"}
              </div>

              <div className="hero--head">
                <h1>Customers</h1>
                <button onClick={generateExcelSheet}>
                  download
                </button>
                {!isAdmin() && (
                  <button
                    onClick={() => {
                      navigate("/create/client");
                    }}
                  >
                    Add New
                    <img src={arrow}></img>
                  </button>
                )}
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
                    <input
                      className="calender"
                      type="date"
                      name="Select date"
                      onChange={onDateSelect}
                    />
                  </form>
                  <div className="table-wrapper">
                    <table className="fl-table table-hame">
                      <thead>
                        <tr>
                          <th>DP</th>
                          <th>Name</th>
                          <th>FName</th>
                          <th>Phone Number</th>
                          {isAdmin() && <th>CNIC No</th>}
                          <th>GENDER</th>
                          {isAdmin() && <th>Created By</th>}
                          {isAdmin() && <th>Agent ID</th>}

                          <th>Plots</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomersDataMemoized.map((e) => (
                          <tr key={e.Cnic}>
                            <td>
                              {" "}
                              <img
                                src={
                                  e.Gender === "female"
                                    ? isAdmin()
                                      ? e.imgUrl
                                      : avatar
                                    : e.imgUrl
                                }
                                alt="avatar"
                                className="avatar-table"
                              />
                            </td>
                            <td>
                              {/* <img
                                src={
                                  e.Gender === "female"
                                    ? isAdmin()
                                      ? e.imgUrl
                                      : avatar
                                    : e.imgUrl
                                }
                                alt="avatar"
                                className="avatar-table"
                              /> */}
                              <p>{e.Name}</p>
                            </td>
                            <td>{e.FName}</td>

                            <td>{e.phNo}</td>
                            {isAdmin() && <td>{cnicFormat(e.Cnic)}</td>}
                            <td>{e.Gender}</td>
                            {isAdmin() && <td>{e.agentName}</td>}
                            {isAdmin() && <td>{cnicFormat(e.agentId)}</td>}

                            <td className="tddr">
                              <p>{e.Plots.length} Plots</p>
                            </td>
                            <td>
                              <button
                                className="button-view"
                                onClick={() =>
                                  navigate(`/details/client/${e.Cnic}`)
                                }
                              >
                                View
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

export default AdminHome;
