import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import avatar from "../../Assets/avatar.png";
import SideBar from "../../components/Sidebar/sidebar";

import "./employs.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

function Empdetafinance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);
  const [empDetails, setEmpDetails] = useState({});
  const [empInvoices, setEmpInvoices] = useState([]);

  useEffect(() => {
    getEmpData();
    getInvoices();
  }, []);
  async function getEmpData() {
    const docRef = doc(db, "Employe", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setEmpDetails(docSnap.data());
      setisLoading(false);
    } else {
      // docSnap.data() will be undefined in this case
      navigate("/");
    }
  }
  async function getInvoices() {
    console.log("running", id);
    const q = query(collection(db, "Payslip"), where("uid", "==", id));
    const querySnapshot = await getDocs(q);
    let temp = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());

      temp.push({ ...doc.data(), id: doc.id });
    });
    setEmpInvoices(temp);
  }
  return (
    <>
      <SideBar
        element={
          isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="empdatafinance-main">
                <div className="empl-hero-head">
                  <h3>Employee Detail</h3>
                </div>
                <div className="empdata-column-1">
                  <div className="empdata-coldata-1">
                    <div className="coldata-1-data">
                      <div className="col-data-1">
                        <h5>Name :</h5>
                        <h5>Address :</h5>
                        <h5>Cnic :</h5>
                        <h5>Designation :</h5>
                        <h5>Department :</h5>
                      </div>
                      <div className="col-data-2">
                        <span>{empDetails.name}</span>
                        <span>{empDetails.address}</span>
                        <span>{empDetails.cnic}</span>
                        <span>{empDetails.designation}</span>
                        <span>{empDetails.department}</span>
                      </div>
                    </div>
                  </div>
                  <div className="empdata-colmn-2">
                    <div className="empl-hero-head-sec">
                      <h4>Pay Invoices</h4>

                      <button
                        className="finance-invoice-button"
                        onClick={() =>
                          navigate(`/create/payslip/${id}`, { empDetails })
                        }
                      >
                        <i class="fa-sharp fa-light fa-plus"></i>
                        Add Details
                      </button>
                    </div>
                    <div className="invoice-col-scroll">
                      {empInvoices.map((invoice) => (
                        <div className="mainbox">
                          <div className="content-sec">
                            <div className="content-inner">
                              <span>{invoice.id}</span>
                              <span>{invoice.salarydate}</span>
                            </div>
                            <div className="slip-print-finance-btn">
                              <button
                                onClick={() => {
                                  navigate(`/print/payslip/${invoice.id}`);
                                }}
                              >
                                view
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      />
    </>
  );
}

export default Empdetafinance;
