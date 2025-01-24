import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import { debounce } from "lodash";
import arrow from "../../Assets/Plus.png";
import isAdmin from "../../../IsAdmin";
import "./admininvoice.css";
import SideBar from "../../components/Sidebar/sidebar";

function AdminFiles() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [Id, setId] = useState("");

  useEffect(() => {
    setId(localStorage.getItem("id"));
    console.log(Id);
    getCustomersData();
  }, [Id]);
  const openNewWindow = (Link) => {
    // Open a new window
    const newWindow = window.open("", "_blank");

    // Navigate to the specified URL in the new window
    newWindow.location.href = Link;
  };

  async function getCustomersData() {
    let admin=isAdmin()
    const newCustomersData = [];
    const q = query(collection(db, "Plots"), where("AgentId", "==", Id));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (!doc.data().Blocked) {
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
            data.FileNumber.toLowerCase().includes(searchText.toLowerCase())
          //  ||
          // data.customerName
          //   .toLowerCase()
          //   .includes(searchText.toLowerCase()) ||
          // data.InvId.toLowerCase().includes(searchText.toLowerCase())
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

    return temp;
  }
  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="Admin-Home-invoice">
              <div className="hero--head">
                <h1>Files</h1>
                {/* {isAdmin() && <button
            onClick={() => {
              // navigate("/create/agent/");
            }}
          >
            Add New
            <img src={arrow}></img>
          </button>} */}
              </div>
              <div className="Admin-Home-content">
                <div className="Admin-Home-table">
                  <form className="nosubmit">
                    <input
                      type="text"
                      placeholder="Search by File Number"
                      onChange={(e) => debouncedFilterData(e.target.value)}
                      className="nosubmit"
                    />
                  </form>
                  <div className="table-wrapper">
                    <table className="fl-table">
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Customer Id</th>
                          <th>File Number</th>
                          <th>Agent Name</th>
                          <th>Agent Id</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomersDataMemoized.map((e, index) => (
                          <tr key={index + 1}>
                            <td>{e.CustomerName}</td>
                            <td>{e.CustomerId}</td>
                            <td>{e.FileNumber}</td>
                            <td>{e.AgentName}</td>
                            <td>{e.AgentId}</td>

                            {/* <td>{e.nature}</td>
                            <td>{e.payment}</td>
                            <td>{e.panelty === null ? 1 : 0}</td>
                            <td>{getDate(e.time.seconds)}</td>
                            <td>{e.agentName}</td>
                            <td>{e.verifiedBy}</td> */}

                            <td>
                              <div className="butn-viewer">
                                <div>
                                  <Link
                                    className="button-view button-invoice"
                                    to={`/details/plot/${e.FileNumber}`}
                                  >
                                    View
                                  </Link>
                                </div>
                              </div>
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
export default AdminFiles;
