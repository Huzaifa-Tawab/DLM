import React, { useEffect, useState } from 'react'
import './invoiceStatment.css'
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
function InvoiceStatment() {
    const {id}=useParams();
    const [Transactions, setTransactions] = useState([]);
    useEffect(() => {
     getTransactions()
    }, [])
    
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
    <div className="InvoiceStatment">
        <div className="InS-header">
            <div className="InS-logo">
                <img src="/logo.png" alt="" />
            </div>
            <div className="InS-content"></div>
        </div>
        <div className="InS-Body">
            <table>
                <thead>
                    <th>Invoice ID</th>
                    <th>Date</th>
                    <th>Amount </th>
                    <th>Paid To </th>
                </thead>
                <tbody>
                    {Transactions.map((T,index)=><tr key={index}>
                        <td>{T.nature}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default InvoiceStatment