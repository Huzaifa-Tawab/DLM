import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import { debounce } from "lodash";
import FinanceHeader from "../../components/header/FinanceHeader";
import arrow from "../../Assets/Plus.png";
import SideBar from "../../components/Sidebar/sidebar";
import UploadRequestSS from "../../components/Modals/UploadRequestSS";
import "./buttonswithdrwatable.css";

function FinanceWithdrawal() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getCustomersData();
  }, []);
  const openNewWindow = (Link) => {
    // Open a new window
    const newWindow = window.open("", "_blank");

    // Navigate to the specified URL in the new window
    newWindow.location.href = Link;
  };

  async function getCustomersData() {
    const querySnapshot = await getDocs(collection(db, "WithDraw"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()["status"] === "Approved") {
        let x = doc.data();
        x["id"] = doc.id;
        newCustomersData.push(x);
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
            data.Name.toLowerCase().includes(searchText.toLowerCase()) ||
            data.agentid.toLowerCase().includes(searchText.toLowerCase())
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
    <>
      <SideBar
        element={
          isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="Admin-Home">
                <div className="hero--head">
                  <h1>Invoices</h1>
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
                    <div className="table-wrapper">
                      <table className="fl-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Cnic</th>
                            <th>Cheque Of</th>
                            <th>Cheque Number</th>
                            <th>Time</th>
                            <th>WithDrawal Amount</th>

                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomersDataMemoized.map((e, index) => (
                            <tr key={index}>
                              <td>{e.Name}</td>
                              <td>{e.agentid}</td>
                              <td>{e.chequeOf}</td>
                              <td>{e.chequeNo}</td>
                              <td>{getDate(e.created.seconds)}</td>
                              <td>{e.amount}</td>
                              <td>
                                <button
                                  className="button-viewwwer"
                                  onClick={() => {
                                    openNewWindow(`${e.Proof}`);
                                    console.log(e.Proof);
                                  }}
                                >
                                  View Proof
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
    </>
  );
}

export default FinanceWithdrawal;
