import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import "./adminhome.css";
import avatar from "../../Assets/avatar.png";
import { debounce } from "lodash";
import arrow from "../../Assets/Plus.png";
import isAdmin from "../../../IsAdmin";

function AdminHome() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getCustomersData();
  }, []);

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Customers"));
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
        <div>{isAdmin() && "Admin"}</div>
        <div>{isAdmin() ? "Admin" : "SubAdmin"}</div>

        <div className="hero--head">
          <h1>Customers</h1>
          <button
            onClick={() => {
              navigate("/create/client");
            }}
          >
            Add New
            <img src={arrow}></img>
          </button>
        </div>
        <div className="Admin-Home-content">
          <div className="Admin-Home-table">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => debouncedFilterData(e.target.value)}
              className="input-field"
            />
            <div className="table">
              <table className="adminhome-table">
                <thead>
                  <tr className="hed">
                    <th>Name</th>
                    <th>Phone Number</th>
                    {isAdmin() && <th>CNIC No</th>}
                    <th>FName</th>
                    <th>Gender</th>
                    <th>Plots</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomersDataMemoized.map((e) => (
                    <tr key={e.Cnic}>
                      <td className="avatar-image">
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
                        {e.Name}
                      </td>
                      <td>{e.phNo}</td>
                      {isAdmin() && <th>{e.Cnic}</th>}
                      <td>{e.FName}</td>
                      <td>{e.Gender}</td>

                      <td className="tddr">{e.Plots.length}</td>
                      <td>
                        <button
                          className="button-view"
                          onClick={() => navigate(`/details/client/${e.Cnic}`)}
                        >
                          View Details
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

export default AdminHome;
