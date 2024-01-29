import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import avatar from "../../Assets/avatar.png";
import { debounce } from "lodash";
import arrow from "../../Assets/Plus.png";
import AddExpense from "../../components/Modals/AddExpense";
import isAdmin from "../../../IsAdmin";
import SideBar from "../../components/Sidebar/sidebar";


function AdminExpense() {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getCustomersData();
  }, []);

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Expenses"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()["id"] === id) {
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
            data.by.toLowerCase().includes(searchText.toLowerCase()) ||
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
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  function getDate(seconds) {
    let date = new Date(seconds * 1000);
    let temp = date.toLocaleDateString();
    console.log(temp);
    return temp;
  }
  return isLoading ? (
    <Loader />
  ) : (
    <SideBar
      element={
        <>
          <div className="Admin-Home">
            <div className="hero--head">
              <h1>Expenses</h1>
              <button
                onClick={() => {
                  openModal();
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
                    type="text"
                    placeholder="Search by Id"
                    onChange={(e) => debouncedFilterData(e.target.value)}
                    className="nosubmit"
                  />
                </form>
                <div className="tableFixHead head-head">
                  <table className="adminhome-table head-head">
                    <thead>
                      <tr className="hed">
                        <th className="starter">Sr No</th>
                        <th>Title</th>
                        <th>Amount</th>
                        {isAdmin() && <th>Uploaded by</th>}
                        <th>Date</th>
                        <th>Description</th>
                        {/* <th>More Details</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomersDataMemoized.map((e, index) => (
                        <tr key={index}>
                          <td className="starter">{index + 1}</td>
                          <td>{e.title}</td>
                          <td>PKR {e.amount} </td>
                          {isAdmin() && <td>{e.by}</td>}
                          <td>{getDate(e.created.seconds)}</td>
                          <td>{e.description}</td>

                          {/* <td></td>
                      <td>
                        <button
                          className="button-view"
                          onClick={() => navigate(`/`)}
                        >
                          View
                        </button>
                      </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <AddExpense onClose={closeModal} showModal={showModal} />
        </>
      }
    />
  );
}

export default AdminExpense;
