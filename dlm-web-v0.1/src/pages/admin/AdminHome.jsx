import React, { useEffect } from "react";
import Header from "../../components/header/Header";
import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();
  const [CustomersData, setCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    GetCustomersData();
  }, []);

  async function GetCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Customers"));
    querySnapshot.forEach((doc) => {
      CustomersData.push(doc.data());
      console.log(doc.id, " => ", doc.data());
    });
    setisLoading(false);
  }
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <div className="Admin-Home">
        <div className="Admin-Home-content">
          <div className="Admin-Home-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Cnic No</th>
                  <th>Plots</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {CustomersData.map((e) => {
                  return (
                    <tr key={e.Cnic}>
                      <td>{e.Name}</td>
                      <td>{e.PhNo}</td>
                      <td>{e.Cnic}</td>
                      <td>{e.Plots.length}</td>
                      <td>
                        <button
                          onClick={() => {
                            navigate(`/details/client/${e.Cnic}`);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
