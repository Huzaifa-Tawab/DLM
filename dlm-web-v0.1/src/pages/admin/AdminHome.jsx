import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
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

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Customers"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      newCustomersData.push(doc.data());
    });
    setCustomersData(newCustomersData);
    setFilteredCustomersData([]);
    setisLoading(false);
  }

  const filterData = useCallback(
    (searchText) => {
      let newData = CustomersData;
      if (searchText && searchText.length > 0) {
        newData = CustomersData.filter(
          (data) =>
            data.Name.toLowerCase() == searchText.toLowerCase() ||
            data.Cnic == searchText ||
            data.phNo == searchText ||
            data.Plots.some((plot) =>
              plot.toLowerCase().includes(searchText.toLowerCase())
            )
        );
      } else {
        newData = [];
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
    let list = [];
    let selectedMonth = null;
    let selectedYear = null;
    if (value) {
      let selectedDate = value.split("-");
      selectedMonth = selectedDate[1];
      selectedYear = selectedDate[0];
      CustomersData.forEach((customer) => {
        if (customer.createdAt.seconds) {
          let date = getDate(customer.createdAt.seconds);
          let splitDate = date.split("/");
          let month = splitDate[0];
          if (month.length == 1) {
            month = 0 + month;
          }
          if (splitDate[2] == selectedYear && month == selectedMonth) {
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
                      type="month"
                      name="Select month"
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
