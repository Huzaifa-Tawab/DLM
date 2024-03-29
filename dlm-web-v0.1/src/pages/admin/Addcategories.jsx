import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import { debounce } from "lodash";
import AddStoreItem from "../../components/Modals/AddStoreItem";
import arrow from "../../Assets/Plus.png";
import isAdmin from "../../../IsAdmin";
import SideBar from "../../components/Sidebar/sidebar";
import AddCatagory from "../../components/Modals/AddCatagory";

function AdminCategory() {
  const uid = localStorage.getItem("id");
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [ShowCatagoryModal, setShowCatagoryModal] = useState(false);

  useEffect(() => {
    getCustomersData();
  }, []);

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Store"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()["agentID"] == uid) {
        newCustomersData.push(doc.data());
      } else if (isAdmin()) {
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
            data.agent.toLowerCase().includes(searchText.toLowerCase()) ||
            data.title.toLowerCase().includes(searchText.toLowerCase())
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
    console.log(temp);
    return temp;
  }
  const openCatagoryModal = () => {
    setShowCatagoryModal(true);
  };

  const closeCatagoryModal = () => {
    setShowCatagoryModal(false);
  };
  return (
    <>
    <SideBar
    element={
      isLoading ? (
        <Loader/>
      ) : (
        <>
          <div className="Admin-Home">
            <div className="hero--head">
              <h1>Categories</h1>
              <button
                onClick={() => {
                  openCatagoryModal(true);
                }}
              >
                Add New
                <img src={arrow}></img>
              </button>
            </div>
            <div className="Admin-Home-content">
              <div className="Admin-Home-table">
                <form className="nosubmit">
                  <input
                    className="nosubmit"
                    type="text"
                    placeholder="Search item name/Uploaded By"
                    onChange={(e) => debouncedFilterData(e.target.value)}
                  />
                </form>
                <div className="table-wrapper">
                  <table className="fl-table">
                    <thead>
                      <tr>
                        <th>Sr No</th>
                        <th>Item Name</th>
                        <th>Office No</th>
                        {isAdmin() && <th>Uploaded By</th>}
                        <th>Uploaded At</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomersDataMemoized.map((e, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{e.title}</td>
                          <td>{e.office}</td>
                          {isAdmin() && <td>{e.agent}</td>}
                          <td>{getDate(e.date.seconds)}</td>
                          <td>{e.decs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
       
        </>
  )}
    />
       <AddCatagory
            showModal={ShowCatagoryModal}
            onClose={closeCatagoryModal}
          />
    </>
  );
}

export default AdminCategory;
