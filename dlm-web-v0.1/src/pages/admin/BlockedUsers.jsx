import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import avatar from "../../Assets/avatar.png";
import { debounce } from "lodash";
import arrow from "../../Assets/Plus.png";
import "./adminhome.css";

function BlockedUsers() {
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
      console.log(doc.data().Blocked);

      if (doc.data().Blocked) {
        newCustomersData.push(doc.data());
      }
    });
    setCustomersData(newCustomersData);
    setFilteredCustomersData(newCustomersData);
    setisLoading(false);
  }
  async function toggleBlockStatus(id) {
    setisLoading(true);
    const Ref = doc(db, "Customers", id);
    await updateDoc(Ref, {
      Blocked: false,
    }).then(() => {
      getCustomersData();
      setisLoading(false);
    });
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
        <div className="hero--head">
          <h1>Blocked Users</h1>
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
                    <th className="starter">Name</th>

                    <th>CNIC No</th>
                    <th className="starter">Plots</th>
                    <th className="starter">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomersDataMemoized.map((e) => (
                    <tr key={e.Cnic}>
                      <td>{e.Name}</td>

                      <td>{e.Cnic}</td>
                      <td className="tddr">
                        <span>{e.Plots.length} Plots</span>
                      </td>
                      <td>
                        <button
                          className="button-view"
                          onClick={() => {
                            toggleBlockStatus(e.Cnic);
                          }}
                        >
                          UnBlock User
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

export default BlockedUsers;