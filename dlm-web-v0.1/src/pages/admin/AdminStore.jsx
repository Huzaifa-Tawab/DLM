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

function AdminStore() {
  const uid = localStorage.getItem("id");
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [showDocModal, setShowDocModal] = useState(false);

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
  const openDocModal = () => {
    setShowDocModal(true);
  };

  const closeDocModal = () => {
    setShowDocModal(false);
  };
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <div className="Admin-Home">
        <div className="hero--head">
          <h1>Store</h1>
          <button
            onClick={() => {
              setShowDocModal(true);
            }}
          >
            Add New
            <img src={arrow}></img>
          </button>
        </div>
        <div className="Admin-Home-content">
          <div className="Admin-Home-table">
            <form className="nosubmit">
            <input className="nosubmit"
              type="text"
              placeholder="Search item name/Uploaded By"
              onChange={(e) => debouncedFilterData(e.target.value)}
              
            />
            </form>
            <div className="table">
              <table className="adminhome-table">
                <thead>
                  <tr className="hed">
                    <th className="starter">Sr No</th>
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
                      <td className="starter">{index + 1}</td>
                      <td>{e.title}</td>
                      <td>{e.office}</td>
                      {isAdmin() && <td>{e.agent}</td>}
                      <td>{getDate(e.date.seconds)}</td>
                      <td className="desc-tr">{e.decs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AddStoreItem showModal={showDocModal} onClose={closeDocModal} />
    </>
  );
}

export default AdminStore;
