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


function Archieve() {
  const {id}=useParams()
  const navigate = useNavigate();
  const [pData, setPData] = useState();
  const [isLoading, setIsLoadiing] = useState(true);
  useEffect(() => {
    getData();
  }, []);
  const openNewWindow = (Link) => {
    // Open a new window
    const newWindow = window.open("", "_blank");

    // Navigate to the specified URL in the new window
    newWindow.location =Link;
  };
  function getDate(seconds) {
    let date = new Date(seconds * 1000);
    let temp = date.toLocaleDateString();
    return temp;
  }

  async function getData() {
    const q = query(
      collection(db, "PlotAssets"),
      where("pid", "==",id )
    );

    const querySnapshot = await getDocs(q);

    let temp = [];
    querySnapshot.forEach((doc) => {
  

      let single = doc.data();
      single["id"] = doc.id;
      temp.push(single);
     
    });
setPData(temp)
    // const sortedMaps = Object.values(temp).sort((a, b) => {
    //   return   b.time-a.time; // Assuming the timestamp is a numeric value
    // });
    setIsLoadiing(false)
  }
 
  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="Admin-Home">
              <div className="hero--head">
                <h1>Archieve</h1>
                {/* <h1>{filteredCustomersDataMemoized.length}</h1> */}
              </div>
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
                        {pData.map((e, index) => (
                          <tr key={index}>
                            <td><img src={e.img} alt="" height={'50px'} width={'50px'} /></td>
                            <td>{e.invId}</td>
                            <td>{e.pid}</td>
                            <td>{getDate(e.createdAt.seconds)}</td>

                            <td>
                              <button onClick={()=>{
                            
                                openNewWindow(e.img)
                              }} className="button-view">View</button>
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
