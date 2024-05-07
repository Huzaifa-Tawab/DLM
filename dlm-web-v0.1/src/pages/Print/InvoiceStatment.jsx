import React, { useEffect, useState } from "react";
import "./invoiceStatment.css";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
function InvoiceStatment() {
  const { id } = useParams();
  const [Transactions, setTransactions] = useState([]);
  useEffect(() => {
    getTransactions();
  }, []);

  async function getTransactions() {
    const q = query(
      collection(db, "Transactions"),
      where("fileNumber", "==", id)
    );

    const querySnapshot = await getDocs(q);

    let temp = [];
    querySnapshot.forEach((doc) => {
      // if (doc.data()["varified"]) {
      let single = doc.data();
      single["id"] = doc.id;
      temp.push(single);
      // }
    });
    setTransactions(temp);
  }
  return (
    <div className="webpage">
      <div className="main-page">
        <div className="sub-page">
          <div className="InS-header">
            <div className="InS-logo">
              <img src="/logo.png" alt="" />
            </div>
            <div className="InS-content">
              <h2>Plot Statement</h2>
            </div>
            <div className="Ins-head-date">
              <h4>Date:</h4>
              <span>Date</span>
            </div>
          </div>
          <div className="Ins-body-content">
            <div className="Ins-cont-col1">
              <h5>Customer Name:</h5>
              <h5>File/Plot NO:</h5>
              <h5>Installment Statement:</h5>
              <h5>Date:</h5>
            </div>
            <div className="Ins-cont-col2">
              <span>Name</span>
              <span>Plotnumber</span>
              <span>instalment</span>
              <span>date</span>
            </div>
          </div>
          <div className="InS-Body">
            <table>
              <thead>
                <th>Serial NO</th>
                <th>Install Month</th>
                <th>Deposit Date </th>
                <th>Penality</th>
              </thead>
              <tbody>
                {Transactions.map((T, index) => (
                  <tr key={index}>
                    <td>{T.nature}</td>
                    <td>Instal month</td>
                    <td>depositmonth</td>
                    <td>{T.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table>
              <thead>
                <th>Uploaded By</th>
                <th>Approved By</th>
                <th>Remaining Amount</th>
              </thead>
              <tbody>
                {Transactions.map((T, index) => (
                  <tr key={index}>
                    <td>uploadedby</td>
                    <td>approved by</td>
                    <td>remaining amount</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceStatment;
