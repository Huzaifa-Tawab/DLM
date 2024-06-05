import  { useEffect, useState } from "react";
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
      console.log(doc.data().time.toDate().toString());
      console.log(Transactions);
      single["id"] = doc.id;
      temp.push(single);
      // }
    });

    const sortedMaps = Object.values(temp).sort((a, b) => {
      return   b.time-a.time; // Assuming the timestamp is a numeric value
    });

    setTransactions(sortedMaps);
  }
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return (
    <div className="webpage">
      <div className="main-page">
        <div className="sub-page">
          <div className="InS-header">
            <div className="InS-logo">
              <img src="/logo.png" alt="" />
            </div>
            <div className="InS-content">
              <h2>Statement</h2>
              <h4>{id}</h4>
            </div>
            <div className="Ins-head-date">
              <span> <strong>Date: </strong> </span>
              <span>{formattedDate}</span>
            </div>
          </div>
          {/* <div className="Ins-body-content">
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
          </div> */}
          <div className="InS-Body">
            <table>
              <thead>
                <th>S.N</th>
                <th>Invoice #</th>
                <th>Number Of Months</th>
                <th>Deposit Date </th>
                <th>Uploaded by</th>
                <th>Approved By</th>
                <th>Deposit</th>
                <th>Remaining</th>
              </thead>
              <tbody>
                {Transactions.map((T, index) => (
                  <tr key={index}>

                    <td>{index + 1}</td>
                    <td>{T.InvId}</td>
                    <td>{T.numberofInstallmentMonth} Month(s)</td>
                    <td>
                      {T.time.toDate().getDate().toString()} / {(T.time.toDate().getMonth()+1).toString()} / {T.time.toDate().getFullYear().toString()}
                    </td>
                    <td>{T.agentName}</td>
                    <td>{T.verifiedBy}</td>
                    <td>{T.payment}</td>
                    <td>{T.remainingAmount}</td>
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
//  Install Month  Penalty Uploaded by Approved By Deposit Remaining