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
        <div className="admin-show">{isAdmin() && "Admin"}</div>
        <div className="admin-show">{isAdmin() ? "Admin" : "SubAdmin"}</div>

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
            <form class="nosubmit">
              <input
                class="nosubmit"
                type="search"
                placeholder="Search by Id"
                onChange={(e) => debouncedFilterData(e.target.value)}
              />
            </form>
            <div className="table">
              <table className="adminhome-table">
                <thead>
                  <tr className="hed">
                    <th className="starter">Name</th>
                    <th>FName</th>
                    <th>Phone Number</th>
                    {isAdmin() && <th>CNIC No</th>}
                    <th>GENDER</th>
                    <th className="starter">Plots</th>
                    <th className="starter">Actions</th>
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
                        <span>{e.Name}</span>
                      </td>
                      <td>{e.FName}</td>

                      <td>{e.phNo}</td>
                      {isAdmin() && <td>{e.Cnic}</td>}
                      <td>{e.Gender}</td>
                      <td className="tddr">
                        <span>{e.Plots.length} Plots</span>
                      </td>
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
