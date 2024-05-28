import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SideBar from "../../components/Sidebar/sidebar";
import Loader from "../../components/loader/Loader";
import { db } from "../../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

function Files() {
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    getdata();
  }, []); // Include 'id' in the dependency array

  async function getdata() {
    const docRef = collection(db, "Plots");
    const docSnap = await getDocs(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      //   setCustomer(docSnap.data());

      //   if (docSnap.data().Plots != null) {
      //     console.log("ok");
      //     // Correct 'setUseDocs' to whatever state you intended to set here
      //     // setUseDocs(docSnap.data().Document);
      //   }
      setIsLoading(false);
    }
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
                  <h1>Files</h1>
                </div>
                <div className="Admin-Home-content">
                  <div className="Admin-Home-table">
                    <form className="nosubmit">
                      <input
                        className="nosubmit"
                        type="search"
                        placeholder="Search by Id"
                      />
                    </form>
                    <div className="table-wrapper">
                      <table className="fl-table">
                        <thead>
                          <tr>
                            <th>Customer Name</th>
                            <th>Agent Name</th>
                            <th>File Number</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customer ? (
                            <tr key={customer.id}>
                              <td>{customer.Name}</td>
                              <td>{customer.AgentName}</td>
                              <td>{customer.FileNumber}</td>
                              <td>
                                <button
                                  className="button-viewwww"
                                  onClick={() => {}}
                                >
                                  <Link to={`#`}>View</Link>
                                </button>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan="4">No customer data found.</td>
                            </tr>
                          )}
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

export default Files;
