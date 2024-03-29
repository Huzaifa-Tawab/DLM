import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./clientform.css";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import generateRandomString from "../../../RandomString";
// const axios = require("axios");
import axios from "axios";
// import SideBar from "../../components/Sidebar/sidebar";
import SideBar from "../../components/Sidebar/sidebar";

const ErrorMessage = ({ message }) => (
  <span style={{ color: "red", fontSize: "0.8em" }}>{message}</span>
);

const TextInput = ({ label, name, value, onChange, error }) => (
  <div style={{ marginBottom: "10px" }}>
    <label style={{ display: "block", marginBottom: "5px" }}>{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      style={{ width: "100%", padding: "8px" }}
    />
    {error && <ErrorMessage message={error} />}
  </div>
);

const RadioInput = ({ label, name, value, checked, onChange }) => (
  <label style={{ marginRight: "20px" }}>
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {label}
  </label>
);

const CheckboxInput = ({ label, name, checked, onChange, error }) => (
  <div style={{ marginBottom: "10px" }}>
    <label style={{ display: "block" }}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />{" "}
      {label}
    </label>
    {error && <ErrorMessage message={error} />}
  </div>
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

const AgentEditForm = () => {
  const prams = useParams();
  const [AgentList, setAgentList] = useState([]);

  const [File, setFile] = useState();
  const [InvoiceID, setInvoiceID] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    FName: "",
    Cnic: "",
    phNo: "",
    Gender: "male",
    Dob: "",
    Address: "",
    TownCity: "",
    Gmail: "",
    Plots: [],
    Documents: [],
    agree: false,
    InvId: InvoiceID,
    ChildOf: "",
  });
  useEffect(() => {
    getAgentsList();
    if (prams.id) {
      getCurrentAgentData();
    }
  }, [prams]);

  async function getAgentsList() {
    const querySnapshot = await getDocs(collection(db, "Agent"));
    let temp = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      temp.push({
        key: doc.id,
        value: doc.data().Name,
      });
    });
    setAgentList(temp);
  }

  async function getCurrentAgentData() {
    const AgentdocSnap = await getDoc(doc(db, "Agent", prams.id));
    if (AgentdocSnap.exists()) {
      setFormData(AgentdocSnap.data());
      setAvatarPreview(AgentdocSnap.data().imgUrl);
    }
  }
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      if (File) {
        uploadImageToFirebase();
      } else {
        updateName();
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.Name.trim()) {
      errors.Name = "Name is required";
    }

    if (!data.FName.trim()) {
      errors.FName = "Father's Name is required";
    }

    if (!data.phNo.trim()) {
      errors.phNo = "Phone No is required";
    }
    if (!data.TownCity.trim()) {
      errors.TownCity = "Please specify your city/town";
    }
    if (!data.Address.trim()) {
      errors.Address = "Please enter you living address";
    }

    if (!data.Dob.trim()) {
      errors.Dob = "Please enter you date of birth";
    }

    return errors;
  };

  const UpdateAgentData = async () => {
    await setDoc(doc(db, "Agent", formData.Cnic), formData);
    navigate(`/details/agent/${formData.Cnic}`);
  };
  function uploadImageToFirebase() {
    const storageRef = ref(storage, `/ProfilePhotos/${formData.Cnic}`);
    const uploadTask = uploadBytesResumable(storageRef, File);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          formData["imgUrl"] = url;
          updateName();
        });
      }
    );
  }

  const updateName = async () => {
    await setDoc(doc(db, "Users", formData.Cnic), {
      Name: formData.Name,
    });
    UpdateAgentData();
    // uploadImageToFirebase();
  };
  return (
    <>
      <SideBar />
      <div className="container">
        <h1 className="title-form" style={{ textAlign: "justify" }}>
          Registration Form {InvoiceID}
        </h1>
        <div className="content">
          <form action="#" onSubmit={handleSubmit}>
            <FileInput
              label="Upload Profile Image"
              onChange={handleFileChange}
              previewUrl={avatarPreview}
            />
            <div className="user-details">
              <div className="input-box">
                <TextInput
                  label="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  error={errors && errors.Name}
                />
              </div>
              <div className="input-box">
                <TextInput
                  label="Father's Name"
                  name="FName"
                  value={formData.FName}
                  onChange={handleChange}
                  error={errors && errors.FName}
                />
              </div>

              <div className="input-box">
                <TextInput
                  label="Phone Number"
                  name="phNo"
                  value={formData.phNo}
                  onChange={handleChange}
                  error={errors && errors.phNo}
                />
              </div>
              <div className="input-box">
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Reffered By:
                  </label>
                  <select
                    value={formData.ChildOf}
                    onChange={(e) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        ["ChildOf"]: e.target.value,
                      }));
                    }}
                  >
                    <option value="">Select</option>
                    {AgentList.map((e, index) => (
                      <option key={index} value={e.key}>
                        {e.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div class="gender-details">
              <input
                type="radio"
                id="dot-1"
                label="Male"
                name="Gender"
                value="male"
                checked={formData.Gender === "male"}
                onChange={handleChange}
              />
              <input
                type="radio"
                id="dot-2"
                label="Female"
                name="Gender"
                value="female"
                checked={formData.Gender === "female"}
                onChange={handleChange}
              />
              <span class="gender-title">Gender</span>
              <div class="category">
                <label htmlfor="dot-1">
                  <span class="dot one"></span>
                  <span class="gender">Male</span>
                </label>
                <label htmlfor="dot-2">
                  <span class="dot two"></span>
                  <span class="gender">Female</span>
                </label>
              </div>
            </div>
            <div className="user-details">
              <div className="input-box">
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Date of Birth:
                  </label>
                  <input
                    type="date"
                    name="Dob"
                    value={formData.Dob}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px" }}
                    error={errors.Dob}
                  />
                </div>
              </div>
              <div className="input-box">
                <TextInput
                  label="City/Town"
                  name="TownCity"
                  value={formData.TownCity}
                  onChange={handleChange}
                  error={errors.TownCity}
                />
              </div>
              <div className="input-box">
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Address:
                  </label>
                  <input
                    name="Address"
                    value={formData.Address}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px" }}
                    error={errors.Address}
                  ></input>
                </div>
              </div>
            </div>
            <div className="download-pdf">
              <a href={"/pdfs/sample.pdf"}>Download privacy policy</a>
            </div>
            <div className="check-box">
              <CheckboxInput
                label="I have read and agreed to privacy policy"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
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
  );
};

export default AgentEditForm;
