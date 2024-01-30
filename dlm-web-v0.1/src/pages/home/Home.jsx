// Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import "./home.css";
import Header from "../../components/header/Header";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Footer from "../../components/Footer/Footer";
import logo from "../../Assets/SoftXion.png";

const Home = () => {
  const [referenceId, setReferenceId] = useState("");
  const [cnic, setCnic] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!referenceId) {
      isValid = false;
      newErrors.referenceId = "Reference ID is required.";
    }

    if (!cnic || !/^\d{5}-\d{7}-\d{1}$/.test(cnic)) {
      isValid = false;
      newErrors.cnic = "CNIC format is invalid. Use 12345-6789012-3.";
    }

    if (!phoneNumber || !/^\d{11}$/.test(phoneNumber)) {
      isValid = false;
      newErrors.phoneNumber = "Phone number must be 11 digits.";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCnicChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue = inputValue.replace(
      /(\d{5})(\d{7})(\d{1})/,
      "$1-$2-$3"
    );
    setCnic(formattedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Your submit logic goes here
    GetCustomerData();
    // navigate("/plot/details", { state: "Xyz" });
  };

  async function GetCustomerData() {
    let cnicR = cnic.replace(/-/g, "");

    console.log(cnicR);
    const docRef = doc(db, "Customers", cnicR);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      if (docSnap.data().Blocked) {
        console.log("jhhjkhkjhjkh");

        navigate("/blocked");
      } else {
        if (docSnap.data()["phNo"] == phoneNumber) {
          console.log("Number OK");
          if (docSnap.data()["Plots"].includes(referenceId)) {
            console.log("Ref OK");

            navigate("/details/plot", {
              state: {
                img: docSnap.data()["imgUrl"],
                name: docSnap.data()["Name"],
                plotRef: referenceId,
              },
            });
          } else {
            // navigate("/404");
          }
        } else {
          // navigate("/404");
        }
      }
    }
  }
  return isLoading ? (
    <Loader />
  ) : (
    <div className="home-container">
      <h2>Plot Details Portal</h2>
      <form onSubmit={handleSubmit} className="home-form">
        <label>
          Reference ID:
          <br />
          <input
            type="text"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            className="input-field"
          />
        </label>
        {errors.referenceId && (
          <div className="error-message">{errors.referenceId}</div>
        )}
        <br />
        <label>
          CNIC:
          <br />
          <input
            type="text"
            value={cnic}
            onChange={handleCnicChange}
            className="input-field"
          />
        </label>
        {errors.cnic && <div className="error-message">{errors.cnic}</div>}
        <br />
        <label>
          Phone Number:
          <br />
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
            }
            className="input-field"
          />
        </label>
        {errors.phoneNumber && (
          <div className="error-message">{errors.phoneNumber}</div>
        )}
        <br />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Home;
