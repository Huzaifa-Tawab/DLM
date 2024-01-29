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
import "./adminhome.css";
import SideBar from "../../components/Sidebar/sidebar";

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

  return(
    <>
    <SideBar
    element={
      isLoading ? (
        <Loader/>
      ) : (
        <>
          <div className="Admin-Home">
            <div className="hero--head">
              <h1>Agents</h1>
              <button
                onClick={() => {
                  navigate("/create/agent/");
                }}
              >
                Add New
                <img src={arrow}></img>
              </button>
            </div>
            <div className="Admin-Home-content">
              <div className="Admin-Home-table">
                <form class="nosubmit">
                  <input
                    type="text"
                    placeholder="Search by Id"
                    onChange={(e) => debouncedFilterData(e.target.value)}
                    className="nosubmit"
                  />
                </form>
                <div className="tableFixHead">
                  <table className="adminhome-table">
                    <thead className="width-adjust">
                      <tr className="hed">
                        <th className="width-adjust">Name</th>
                        <th className="width-adjust">Phone Number</th>
                        <th className="width-adjust">CNIC No</th>
                        <th className="width-adjust">Plots</th>
                        <th className="width-adjust">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomersDataMemoized.map((e) => (
                        <tr className="width-adjust" key={e.Cnic}>
                          <td className="avatar-image width-adjust">
                            <img
                              src={avatar}
                              alt="avatar"
                              className="avatar-table"
                            />
                            {e.Name}
                          </td>
                          <td className="width-adjust">{e.phNo}</td>
                          <td className="width-adjust">{e.Cnic}</td>
                          <td className="tddr width-adjust">
                            <p>{e.Plots.length} Plots</p>
                          </td>
                          <td className="width-adjust">
                            <button
                              className="button-view"
                              onClick={() =>
                                navigate(`/details/agent/${e.Cnic}`)
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
   ) }
    />
    </>
  );
}

export default AdminAgents;
