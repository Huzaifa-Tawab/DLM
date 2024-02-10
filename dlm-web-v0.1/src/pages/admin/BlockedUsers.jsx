import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import avatar from "../../Assets/avatar.png";
import { debounce } from "lodash";
import arrow from "../../Assets/Plus.png";
import "./adminhome.css";
import SideBar from "../../components/Sidebar/sidebar";
import getDate from "../../../GetDDMMYY";

function BlockedUsers() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);

  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isloading, setisLoading] = useState(true);

  useEffect(() => {
    getCustomersData();
  }, []);

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Plots"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.data());

      if (doc.data().Blocked) {
        newCustomersData.push(doc.data());
      }
    });
    setCustomersData(newCustomersData);
    setFilteredCustomersData(newCustomersData);
    setisLoading(false);
  }
  async function toggleBlockStatus(id) {
    setisLoading(true);
    const Ref = doc(db, "Plots", id);
    await updateDoc(Ref, {
      Blocked: false,
    }).then(() => {
      getCustomersData();
      setisLoading(false);
    });
  }
  const filterData = useCallback(
    (searchText) => {
      let newData = CustomersData;
      if (searchText && searchText.length > 0) {
        newData = CustomersData.filter(
          (data) =>
            data.Name.toLowerCase().includes(searchText.toLowerCase()) ||
            data.Cnic.toLowerCase().includes(searchText.toLowerCase()) ||
            data.Plots.some((plot) =>
              plot.toLowerCase().includes(searchText.toLowerCase())
            )
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

  return (
    <SideBar
      element={
        isloading ? (
          <Loader />
        ) : (
          <>
            <div className="Admin-Home">
              <div className="hero--head">
                <h1>Blocked User Plots</h1>
              </div>
              <div className="Admin-Home-content">
                <div className="Admin-Home-table">
                  <form className="nosubmit">
                    <input
                      type="text"
                      placeholder="Search by Id"
                      onChange={(e) => debouncedFilterData(e.target.value)}
                      className="nosubmit"
                    />
                  </form>
                  <div className="table-wrapper">
                    <table className="fl-table">
                      <thead>
                        <tr>
                          <th>Customer Name</th>

                          <th>Agent Name</th>

                          <th>File Number</th>
                          <th>Last Payment</th>
                          <th>Society</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomersDataMemoized.map((e) => (
                          <tr key={e.FileNumber}>
                            <td>{e.CustomerName}</td>
                            <td>{e.AgentName}</td>
                            <td>{e.FileNumber}</td>

                            <td>{getDate(e.lastPayment.seconds)}</td>
                            <th>{e.Society}</th>

                            <td>
                              <button
                                className="button-view"
                                onClick={() => {
                                  toggleBlockStatus(e.FileNumber);
                                }}
                              >
                                UnBlock User
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

export default BlockedUsers;
