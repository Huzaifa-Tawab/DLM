import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { debounce } from "lodash";
import AddTransactions from "../../components/Modals/AddTransactions";

function FinancePlotsView() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState("");
  const [PlotIdForModal, setPlotIdForModal] = useState("");
  const [CustomerIdForModal, setCustomerIdForModal] = useState("");
  const [CatagoryForModal, setCatagoryForModal] = useState("");
  const [AgentIdForModal, setAgentIdForModal] = useState("");

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
    const querySnapshot = await getDocs(collection(db, "Plots"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()["verified"]) {
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
            data.AgentName.toLowerCase().includes(searchText.toLowerCase()) ||
            data.CustomerName.toLowerCase().includes(
              searchText.toLowerCase()
            ) ||
            data.FileNumber.toLowerCase().includes(searchText.toLowerCase())
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
  function closeInvoiceModal() {
    setShowInvoiceModal(false);
  }
  return isLoading ? (
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
                placeholder="Search..."
                onChange={(e) => debouncedFilterData(e.target.value)}
              />
            </form>

            {/* <input
              type="text"
              placeholder="Search"
              
              className="input-field"
            /> */}
            <div className="table">
              <table className="adminhome-table">
                <thead>
                  <tr className="hed">
                    <th>File Number</th>
                    <th>Customer Name</th>
                    <th>Plot Size</th>
                    <th>Last Payment</th>
                    <th>Location</th>
                    <th>Agent Name</th>

                    <th className="table-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomersDataMemoized.map((e, index) => (
                    <tr key={index}>
                      <td>{e.FileNumber}</td>
                      <td>{e.CustomerName}</td>
                      <td>{e.PlotSize} Marla</td>
                      <td>{getDate(e.lastPayment.seconds)}</td>
                      <td>{e.Address}</td>

                      <td>{e.AgentName}</td>
                      {/* <td>{e.payment}</td>
                      <td>{e.panelty}</td> */}

                      <td className="table-center">
                        <button
                          className="button-view"
                          onClick={() => {
                            setCustomerIdForModal(e.CustomerId);
                            setAgentIdForModal(e.AgentId);
                            setCatagoryForModal(e.Category);
                            setPlotIdForModal(e.FileNumber);

                            setShowInvoiceModal(true);
                          }}
                        >
                          New Invoice
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

      <AddTransactions
        showModal={showInvoiceModal}
        onClose={closeInvoiceModal}
        cid={CustomerIdForModal}
        aid={AgentIdForModal}
        pid={PlotIdForModal}
        cata={CatagoryForModal}
      />

      {/* <FinanceInvoice
        showModal={}
        onClose={closeInvoiceModal}
        pid={PlotIdForModal}
      /> */}
    </>
  );
}

export default FinancePlotsView;
