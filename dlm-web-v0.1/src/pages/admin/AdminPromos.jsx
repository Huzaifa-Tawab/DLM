import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import avatar from "../../Assets/avatar.png";
import { debounce } from "lodash";
import arrow from "../../Assets/Plus.png";
import AddExpense from "../../components/Modals/AddExpense";
import isAdmin from "../../../IsAdmin";
import SideBar from "../../components/Sidebar/sidebar";
import AddPromo from "../../components/Modals/AddPromo";

function AdminPromos() {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getCustomersData();
  }, []);

  async function getCustomersData() {
    const currentTimestamp = Timestamp.fromDate(new Date());

    const promoQuery = query(
      collection(db, "Promos"),
      where("endsAt", ">", currentTimestamp)
    );
    const promoSnapshot = await getDocs(promoQuery);
    let tempdocs = [];
    promoSnapshot.forEach((doc) => {
      tempdocs.push(doc.data());
    });
    setCustomersData(tempdocs);

    setisLoading(false);
  }

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  function getDate(seconds) {
    let date = new Date(seconds * 1000);
    let temp = date.toLocaleDateString();
    console.log(temp);
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
                  <h1>Promos</h1>
                  <button
                    onClick={() => {
                      openModal();
                    }}
                  >
                    Add New
                    <img src={arrow}></img>
                  </button>
                </div>
                <div className="Admin-Home-content">
                  <div className="Admin-Home-table">
                    <div className="tableFixHead head-head">
                      <table className="adminhome-table head-head">
                        <thead>
                          <tr className="hed">
                            <th className="starter">Sr No</th>
                            <th>Title</th>
                            <th>Target</th>

                            <th>Prize</th>
                            <th>Created</th>
                            <th>Ending</th>
                            {/* <th>More Details</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {CustomersData.map((e, index) => (
                            <tr key={index}>
                              <td className="starter">{index + 1}</td>
                              <td>{e.title}</td>
                              <td>{e.target}</td>
                              <td> {e.prize} </td>
                              <td>{getDate(e.createdAt.seconds)}</td>
                              <td>{getDate(e.endsAt.seconds)}</td>

                              {/* <td></td>
                      <td>
                        <button
                          className="button-view"
                          onClick={() => navigate(`/`)}
                        >
                          View
                        </button>
                      </td> */}
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
      <AddPromo onClose={closeModal} showModal={showModal} />
    </>
  );
}

export default AdminPromos;
