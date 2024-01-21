import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import { debounce } from "lodash";
import arrow from "../../Assets/Plus.png";
import isAdmin from "../../../IsAdmin";

function AdminInvoives() {
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
    const querySnapshot = await getDocs(collection(db, "Transactions"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()["varified"]) {
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
            data.agentName.toLowerCase().includes(searchText.toLowerCase()) ||
            data.customerName
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            data.fileNumber.toLowerCase().includes(searchText.toLowerCase())
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
  return isLoading ? (
    <Loader />
  ) : (
    <Loader />
    // <>
    //   <Header />
    //   <div className="Admin-Home">
    //     <div className="hero--head">
    //       <h1>Invoices</h1>
    //       {/* <button
    //         onClick={() => {
    //           navigate("/create/agent/");
    //         }}
    //       >
    //         Add New
    //         <img src={arrow}></img>
    //       </button>
    //     </div>
    //     <div className="Admin-Home-content">
    //       <div className="Admin-Home-table">
    //         <input
    //           type="text"
    //           placeholder="Search"
    //           onChange={(e) => debouncedFilterData(e.target.value)}
    //           className="input-field"
    //         />
    //         <div className="table">
    //           <table className="adminhome-table">
    //             <thead>
    //               <tr className="hed">
    //                 <th className="starter">Name</th>
    //                 <th>Approved By</th>
    //                 <th>File Number</th>
    //                 <th>Nature</th>
    //                 <th>Payment</th>
    //                 <th>Penalty</th>
    //                 <th>Date</th>
    //                 <th className="starter">Actions</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {filteredCustomersDataMemoized.map((e, index) => (
    //                 <tr key={index + 1}>
    //                   <td className="starter">{e.customerName}</td>
    //                   <td>{e.agentName}</td>
    //                   <td>{e.fileNumber}</td>
    //                   <td>{e.nature}</td>
    //                   <td>{e.payment}</td>
    //                   <td>{e.panelty}</td>
    //                   <td>{getDate(e.time.seconds)}</td>
    //                   <td>
    //                     <div >
    //                     <div >{isAdmin() && <button
    //                       className="button-view"
    //                       onClick={() => {
    //                         openNewWindow(e.proof);
    //                       }}
    //                     >
    //                       View
    //                     </button>}</div>

    //                     <button
    //                       className="button-view"
    //                       onClick={() => {
    //                         // openNewWindow(e.InvId);
    //                         openNewWindow(`/print/invoice/${e.InvId}`);
    //                       }}
    //                     >
    //                       Print
    //                     </button>
    //                     </div>
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <Footer />
    // </>
  );
}

export default AdminInvoives;
