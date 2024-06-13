import React, { useEffect, useState } from "react";
import SideBar from "../../components/Sidebar/sidebar";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import "./plotlogs.css";
export default function PlotLogs() {
  const [logs, setLogs] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    getDataFromFirebase();
  }, []);
  async function getDataFromFirebase() {
    let temp = [];
    if (id == "all") {
    } else {
      const q = query(collection(db, "PlotLogs"), where("pid", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        temp.push(doc.data());
      });
      setLogs(temp);
    }
  }
  return (
    <div>
      <SideBar
        element={
          <div>
            {logs.map((log, i) => {
              const thisAmount = log?.thisAmount ?? 0;
              const verifiedBy = log?.verifiedBy ?? "N/A";
              const invID = log?.invID ?? "N/A";
              const pid = log?.pid ?? "N/A";
              const totalPlotValue = log?.totalPlotValue ?? 0;
              const paidAmount = log?.paidbefore || 0;

              const totalPaid = parseInt(paidAmount) + parseInt(thisAmount);
              const remainingBalance = parseInt(totalPlotValue) - totalPaid;
              console.log();
              return (
                <div className="plot-log-container">
                  <div className="hero--head">
                    <h1>Plots Logs</h1>
                  </div>
                  <div className="plot-log-cards-sec">
                    <h3>LOGS</h3>
                    <div className="logs-card" key={i}>
                      Received an installment amount of <strong>PKR: </strong>
                      <span>{thisAmount}</span>, against{" "}
                      <strong>Invoice No.</strong>
                      <span>{invID} </span>&nbsp;
                      {/* is received on &nbsp;{pid} */}
                      approved by <span>{verifiedBy}</span>&nbsp;
                      {/* had total value of PKR{" "}
                  {totalPlotValue}. <br /> */}
                      {/* amount of PKR {totalPaid} has been paid <br /> */}
                      and Remaining Balance is <strong>PKR: </strong>
                      <span>{remainingBalance}</span> as of &nbsp;
                      <span>{log.approvedAt.toDate().toString()}</span>
                      <br /> <br />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        }
      />
    </div>
  );
}
