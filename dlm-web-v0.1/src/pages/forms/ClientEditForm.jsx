import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./clientform.css";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/loader/Loader";

import { useEffect } from "react";

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

const ClientEditForm = () => {
  const prams = useParams();
  const [isUploading, setisUploading] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    FName: "",
    Cnic: "",
    phNo: "",
    Gender: "male",
    Dob: "",
    Address: "",
    TownCity: "",
    NexttoKin: "",
    KinRelation: "",
    CnicKin: "",
    Gmail: "",
    PhNoKin: "",
    Plots: [],
    Documents: {},
    agree: false,
  });
  const [File, setFile] = useState();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  useEffect(() => {
    getCurrentClientData();
  }, [prams]);

  async function getCurrentClientData() {
    const CustomerdocSnap = await getDoc(doc(db, "Customers", prams.id));
    if (CustomerdocSnap.exists()) {
      setFormData(CustomerdocSnap.data());
      if (CustomerdocSnap.data().imgUrl) {
        setAvatarPreview(CustomerdocSnap.data().imgUrl);
      }
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
  function uploadToFirebase() {
    const storageRef = ref(storage, `/ProfilePhotos/${formData.Cnic}`);
    const uploadTask = uploadBytesResumable(storageRef, File);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          formData["imgUrl"] = url;
          updateCustomer();
        });
      }
    );
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setisUploading(true);
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      if (File) {
        uploadToFirebase();
      } else {
        updateCustomer();
      }
    } else {
      setisUploading(false);
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

    if (!data.Cnic || !/^\d{13}$/.test(data.Cnic)) {
      errors.Cnic = "CNIC is required";
    }
    if (!data.phNo || !/^\d{11}$/.test(data.phNo)) {
      errors.phNo = "Phone No is required";
    }
    if (!data.TownCity.trim()) {
      errors.TownCity = "Please specify your city/town";
    }
    if (!data.Address.trim()) {
      errors.Address = "Please enter you living address";
    }
    if (!data.Dob.trim()) {
      errors.Dob = "Please enter you Dob";
    }
    console.log(errors);
    // Add more validation rules as needed

    return errors;
  };

  const isFormValid = Object.keys(errors).length === 0;

  const updateCustomer = async () => {
    await setDoc(doc(db, "Customers", formData.Cnic), formData);
    navigate(`/details/client/${formData.Cnic}`);
  };

  return  (
    <SideBar element={
      isUploading ? 
        <Loader />
:      <>
      <div className="container">
        <h1 className="title" style={{ textAlign: "justify" }}>
          Edit Client Form
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
                  error={errors.Name}
                />
              </div>
              <div className="input-box">
                <TextInput
                  label="Father's Name"
                  name="FName"
                  value={formData.FName}
                  onChange={handleChange}
                  error={errors.FName}
                />
              </div>
              <div className="input-box">
                <TextInput
                  label="Phone Number"
                  name="phNo"
                  value={formData.phNo}
                  onChange={handleChange}
                  error={errors.phNo}
                />
              </div>
            </div>
            <div className="gender-details">
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
              <span className="gender-title">Gender</span>
              <div className="category">
                <label htmlFor="dot-1">
                  <span className="dot one"></span>
                  <span className="gender">Male</span>
                </label>
                <label htmlFor="dot-2">
                  <span className="dot two"></span>
                  <span className="gender">Female</span>
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
            <div className="title">
              <h2>Kin Details</h2>
            </div>

            <div className="user-details">
              <div className="input-box">
                <TextInput
                  label="Name"
                  name="NexttoKin"
                  value={formData.NexttoKin}
                  onChange={handleChange}
                  error={errors.NexttoKin}
                />
              </div>
              <div className="input-box">
                <TextInput
                  label="Relation"
                  name="KinRelation"
                  value={formData.KinRelation}
                  onChange={handleChange}
                  error={errors.KinRelation}
                />
              </div>
              <div className="input-box">
                <TextInput
                  label="Phone No"
                  name="PhNoKin"
                  value={formData.PhNoKin}
                  onChange={handleChange}
                  error={errors.PhNoKin}
                />
              </div>
              <div className="input-box">
                <TextInput
                  label="CNIC No"
                  name="CnicKin"
                  value={formData.CnicKin}
                  onChange={handleChange}
                  error={errors.CnicKin}
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
}/>);
};

export default ClientEditForm;
