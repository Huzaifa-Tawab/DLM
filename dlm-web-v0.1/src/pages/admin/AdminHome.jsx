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
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    GetCustomersData();
  }, []);

  async function GetCustomersData() {
    const querySnapshot = await getDocs(collection(db, "Customers"));
    querySnapshot.forEach((doc) => {
      CustomersData.push(doc.data());
      filteredCustomersData.push(doc.data());
      console.log(doc.id, " => ", doc.data());
    });
    setisLoading(false);
  }

  const filterData = (searchText) => {
    let newData = CustomersData;
    if (searchText && searchText.length > 0) {
      newData = CustomersData.filter((data) => {
        console.log(data.Plots);
        return (
          data.Name.toLowerCase().includes(searchText.toLowerCase()) ||
          data.Cnic.toLowerCase().includes(searchText.toLowerCase()) ||
          data.Plots.some((plot) =>
            plot.toLowerCase().includes(searchText.toLowerCase())
          )
        );
      });
      setFilteredCustomersData(newData);
    } else {
      setFilteredCustomersData(newData);
    }
  };
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
              onChange={(e) => filterData(e.target.value)}
              className="input-field"
            />
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
                {filteredCustomersData.map((e) => {
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
