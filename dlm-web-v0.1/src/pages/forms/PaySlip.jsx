import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";

import "./clientform.css";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import generateRandomString from "../../../RandomString";
// const axios = require("axios");
import axios from "axios";
import Loader from "../../components/loader/Loader";
import SideBar from "../../components/Sidebar/sidebar";

const ErrorMessage = ({ message }) => (
  <span style={{ color: "red", fontSize: "0.8em" }}>{message}</span>
);
const FileInput = ({ label, onChange, previewUrl, error }) => {
  const [isEditMode, setEditMode] = useState(false);

  const handleClick = () => {
    setEditMode(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange(file);
    setEditMode(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        justifyContent: "flex-end",
      }}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Avatar Preview"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={handleClick}
        />
      ) : (
        <div
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "#ccc",
            borderRadius: "50%",
            cursor: "pointer",
            textAlign: "center",
            lineHeight: "150px",
            fontSize: "16px",
          }}
          onClick={handleClick}
        >
          Add Profile Picture
        </div>
      )}
      {error && <ErrorMessage message={error} />}
      {isEditMode && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
      )}
    </div>
  );
};
function PaySlip() {
  const { uid } = useParams();
  console.log(uid);
  const [File, setFile] = useState();
  const [BasicPay, setbasicPay] = useState("");
  const [Allowance, setAllowance] = useState("");
  const [Subtotal, setSubtotal] = useState("");
  const [Netsalary, setNetsalary] = useState("");
  const [SalaryDate, setSalarydate] = useState("");
  const [SalaryMonth, setSalaryMonth] = useState("");
  const [Chequeid, setChequeid] = useState("");
  const [Accountno, setAccountno] = useState("");

  const [isLoading, setisLoading] = useState(false);
  const handleFileChange = (file) => {
    setFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = (e) => {
    setisLoading(true);
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors == false) {
      uplaodToFirebase();
    } else {
      setisLoading(false);
    }
  };

  const validateForm = () => {
    let errors = false;
    if (BasicPay === "") {
      alert("Please Enter Basicpay Amount");
      errors = true;
    }
    if (Allowance == "") {
      alert("Please Enter Allowance Amount");
      errors = true;
    }

    // if (Netsalary == "") {
    //   alert("Please Enter Net Salary");
    //   errors = true;
    // }
    if (SalaryDate == "") {
      alert("Please Enter Salary Date");
      errors = true;
    }
    if (SalaryMonth == "") {
      alert("Please Enter Salary Date");
      errors = true;
    }
    if (Chequeid == "") {
      alert("Please Enter Cheque ID No");
      errors = true;
    }
    if (Accountno == "") {
      alert("Please Enter Account No");
      errors = true;
    }

    // if (AvatarPreview == "") {
    //   alert("Add Image");
    // }

    // console.log(AvatarPreview);
    // console.log(Name);
    // console.log(Number);
    // console.log(Cnicform);
    // console.log(Email);
    // console.log(Formaddres);
    // console.log(Dateobrth);

    return errors;
  };
  async function uplaodToFirebase() {
    console.log(uid);
    await addDoc(collection(db, "Payslip"), {
      uid: uid,
      createdAt: serverTimestamp(),
      basicpay: BasicPay,
      allowance: Allowance,
      subtotal: Subtotal,
      netsalary: Netsalary,
      salarydate: SalaryDate,
      salarymonth: SalaryMonth,
      chequeid: Chequeid,
      accountno: Accountno,
    }).then(() => {
      setisLoading(false);
      alert("Employee Salary Date Uplaoded");
    });
  }
  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="container">
              <h1 className="title-form" style={{ textAlign: "justify" }}>
                Employee Pay Detail Form
              </h1>
              <div className="content">
                <form action="#" onSubmit={handleSubmit}>
                  {/* <FileInput
                    label="Upload Profile Image"
                    onChange={handleFileChange}
                    previewUrl={AvatarPreview}
                  /> */}
                  <div className="user-details">
                    <div className="input-box">
                      <p>Basic Pay</p>
                      <input
                        type="number"
                        label="Name"
                        name="Name"
                        value={BasicPay}
                        onChange={(e) => {
                          setbasicPay(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-box">
                      <p>Allowance</p>
                      <input
                        type="number"
                        label="allowance"
                        name="allowance"
                        value={Allowance}
                        onChange={(e) => {
                          setAllowance(e.target.value);
                        }}
                      />
                    </div>

                    <div className="input-box">
                      <p>Cheque Id/ Trx ID</p>
                      <input
                        type="text"
                        label="text"
                        name="chequeid"
                        value={Chequeid}
                        onChange={(e) => {
                          setChequeid(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-box">
                      <p>Account No</p>
                      <input
                        type="text"
                        label="text"
                        name="text"
                        value={Accountno}
                        onChange={(e) => {
                          setAccountno(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="user-details">
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Salary Date:
                        </label>
                        <input
                          type="date"
                          name="Dob"
                          value={SalaryDate}
                          onChange={(e) => {
                            setSalarydate(e.target.value);
                          }}
                          style={{ width: "100%", padding: "8px" }}
                        />
                      </div>
                    </div>
                    <div className="input-box">
                      <p>Pay Month</p>
                      <input
                        type="text"
                        label="text"
                        name="text"
                        value={SalaryMonth}
                        onChange={(e) => {
                          setSalaryMonth(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  {/* <div className="gender-detasils" style={{ marginBottom: "10px" }}>
       <label style={{ display: "block", marginBottom: "5px" }}>
         Gender:
       </label>
       <div className="category">
         <div className="dot-one">
       <RadioInput
         label="Male"
         name="Gender"
         value="male"
         checked={formData.Gender === "male"}
         onChange={handleChange}
       />
       </div>
       <RadioInput
         label="Female"
         name="Gender"
         value="female"
         checked={formData.Gender === "female"}
         onChange={handleChange}
       />
       </div>
     </div> */}

                  <div className="button">
                    <button
                      type="submit"
                      // disabled={!isFormValid}
                      style={{ padding: "10px" }}
                    >
                      Save & Next
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )
      }
    />
  );
}

export default PaySlip;
