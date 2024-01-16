import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";

import avatar from "../../Assets/avatar.png";
import { debounce } from "lodash";

function AdminAgents() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getCustomersData();
  }, []);

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Agent"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      newCustomersData.push(doc.data());
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

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <div className="Admin-Home">
        <div className="Admin-Home-content">
          <div className="Admin-Home-table">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => debouncedFilterData(e.target.value)}
              className="input-field"
            />
            <div className="table">
              <button
                onClick={() => {
                  navigate("/create/agent/");
                }}
              >
                add new
              </button>
              <table className="adminAgents-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>CNIC No</th>
                    <th>No of Plots</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomersDataMemoized.map((e) => (
                    <tr key={e.Cnic}>
                      <td className="avatar-image">
                        <img
                          src={avatar}
                          alt="avatar"
                          className="avatar-table"
                        />
                        {e.Name}
                      </td>
                      <td>{e.PhNo}</td>
                      <td>{e.Cnic}</td>
                      <td>{e.Plots.length}</td>
                      <td>
                        <button
                          className="button-view"
                          onClick={() => navigate(`/details/client/${e.Cnic}`)}
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
      <Footer />
    </>
  );
}

export default AdminAgents;