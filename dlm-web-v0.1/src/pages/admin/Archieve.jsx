import React, { useEffect, useState, useCallback, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import { debounce } from "lodash";
import FinanceHeader from "../../components/header/FinanceHeader";
import arrow from "../../Assets/Plus.png";
import SideBar from "../../components/Sidebar/sidebar";
import { setDate } from "rsuite/esm/utils/dateUtils";
import AddArchive from "../../components/Modals/AddArchieve";

function Archieve() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pData, setPData] = useState();
  const [isLoading, setIsLoadiing] = useState(true);
  const [ShowModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
    getData();
  };
  const openModal = () => {
    setShowModal(true);
  };
  useEffect(() => {
    getData();
  }, []);
  const openNewWindow = (Link) => {
    var win = window.open();
    win.document.write(
      '<iframe src="' +
        Link +
        '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
    );

    // Open a new window
    // const newWindow =   window.open('' '_blank', 'noopener,noreferrer');;

    // // // Navigate to the specified URL in the new window
    // newWindow.location =Link;
  };
  function getDate(seconds) {
    let date = new Date(seconds * 1000);
    let options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    let datetimeString = date.toLocaleString("en-US", options);

    return datetimeString;
  }

  async function getData() {
    const q = query(collection(db, "PlotAssets"), where("pid", "==", id));

    const querySnapshot = await getDocs(q);
    console.log(q);

    let temp = [];
    querySnapshot.forEach((doc) => {
      let single = doc.data();
      single["id"] = doc.id;
      temp.push(single);
    });
    setPData(temp);
    console.log(temp);
    // const sortedMaps = Object.values(temp).sort((a, b) => {
    //   return   b.time-a.time; // Assuming the timestamp is a numeric value
    // });
    setIsLoadiing(false);
  }

  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <AddArchive showModal={ShowModal} onClose={closeModal} pid={id} />
            <div className="Admin-Home">
              <div className="hero--head">
                <h1>Archieve</h1>
                {/* <h1>{filteredCustomersDataMemoized.length}</h1> */}
              </div>
              <button onClick={openModal}>
                Add New
                <img src={arrow}></img>
              </button>
              <div className="Admin-Home-content">
                <div className="Admin-Home-table">
                  <div className="table-wrapper">
                    <table className="fl-table">
                      <thead>
                        <tr>
                          <td>img</td>
                          <th>Id</th>
                          <th>Plot Number</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pData &&
                          pData.map((e, index) => (
                            <tr key={index}>
                              <td>
                                <img
                                  src={e.img}
                                  alt=""
                                  height={"50px"}
                                  width={"50px"}
                                />
                              </td>
                              <td>{e.invId}</td>
                              <td>{e.pid}</td>
                              <td>{getDate(e.dateTime.seconds)}</td>

                              <td>
                                <button
                                  onClick={() => {
                                    openNewWindow(e.img);
                                  }}
                                  className="button-view"
                                >
                                  View
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
  );
}
export default Archieve;
