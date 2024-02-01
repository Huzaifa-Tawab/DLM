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

function BlockedUsers() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);

  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isloading, setisLoading] = useState(true);

  useEffect(() => {
    getCustomersData();
  }, []);

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Customers"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.data().Blocked);

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
    const Ref = doc(db, "Customers", id);
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
        <Loader/>
      ) : (
        <>
          <div className="Admin-Home">
            <div className="hero--head">
              <h1>Blocked Users</h1>
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
                        <th>Name</th>

                        <th>CNIC No</th>
                        <th>Plots</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomersDataMemoized.map((e) => (
                        <tr key={e.Cnic}>
                          <td>{e.Name}</td>

                          <td>{e.Cnic}</td>
                          <td className="tddr">
                            <span>{e.Plots.length} Plots</span>
                          </td>
                          <td>
                            <button
                              className="button-view"
                              onClick={() => {
                                toggleBlockStatus(e.Cnic);
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
   ) }
    />
  );
}

export default BlockedUsers;
