import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./clientform.css";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import generateRandomString from "../../../RandomString";
// const axios = require("axios");
import axios from "axios";
import Loader from "../../components/loader/Loader";
import SideBar from "../../components/Sidebar/sidebar";

import { onAuthStateChanged } from "firebase/auth";

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
const Emplysdetailsform = () => {
  const [File, setFile] = useState();
  const [Name, setName] = useState("");
  const [Number, setNumber] = useState("");
  const [Cnicform, setCnicform] = useState("");
  const [Formaddres, setFormaddres] = useState("");
  const [Dateobrth, setDateobrth] = useState("");
  const [AvatarPreview, setAvatarPreview] = useState("");
  const [Email, setEmail] = useState("");
  const [Department, setDepartment] = useState("");
  const [Designation, setDesignation] = useState("");
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
    if (Name === "") {
      alert("Please Enter Name");
      errors = true;
    }
    if (Number == "") {
      alert("Please Enter Your Number");
      errors = true;
    }
    if (Cnicform == "") {
      alert("Please Enter Your Cnic Number");
      errors = true;
    }
    if (Email == "") {
      alert("Please Enter Your Email");
      errors = true;
    }
    if (Formaddres == "") {
      alert("Please Enter Your Address");
      errors = true;
    }
    if (Dateobrth == "") {
      alert("Please Enter Date Of Birth");
      errors = true;
    }
    if (Designation == "") {
      alert("Please Enter Your Designation");
      errors = true;
    }
    if (Department == "") {
      alert("Please Enter Your Department");
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
    await addDoc(collection(db, "Employe"), {
      name: Name,
      phone: Number,
      email: Email,
      cnic: Cnicform,
      dob: Dateobrth,
      address: Formaddres,
      designation: Designation,
      department: Department,
    }).then(() => {
      setisLoading(false);
      alert("Employee Uplaoded");
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
                Employee Registration Form
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
                      <p>Name</p>
                      <input
                        label="Name"
                        name="Name"
                        value={Name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-box">
                      <p>Phone Number</p>
                      <input
                        type="tel"
                        label="Phone Number"
                        name="phNo"
                        value={Number}
                        onChange={(e) => {
                          setNumber(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-box">
                      <p>CNIC</p>
                      <input
                        label="CNIC"
                        name="Cnic"
                        value={Cnicform}
                        onChange={(e) => {
                          setCnicform(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-box">
                      <p>Email</p>
                      <input
                        type="email"
                        label="Email"
                        name="Email"
                        value={Email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-box">
                      <p>Department</p>
                      <input
                        type="text"
                        label="text"
                        name="Department"
                        value={Department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-box">
                      <p>Designation</p>
                      <input
                        type="text"
                        label="text"
                        name="Designation"
                        value={Designation}
                        onChange={(e) => {
                          setDesignation(e.target.value);
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
                          Joining Date:
                        </label>
                        <input
                          type="date"
                          name="Dob"
                          value={Dateobrth}
                          onChange={(e) => {
                            setDateobrth(e.target.value);
                          }}
                          style={{ width: "100%", padding: "8px" }}
                        />
                      </div>
                    </div>
                    <div className="input-box">
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
                          Address:
                        </label>
                        <input
                          name="Address"
                          value={Formaddres}
                          onChange={(e) => {
                            setFormaddres(e.target.value);
                          }}
                          style={{ width: "100%", padding: "8px" }}
                        ></input>
                      </div>
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
};

export default Emplysdetailsform;
