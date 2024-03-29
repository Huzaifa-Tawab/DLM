import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./clientform.css";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/loader/Loader";
import { useEffect } from "react";
import SideBar from "../../components/Sidebar/sidebar";
import { onAuthStateChanged } from "firebase/auth";
import cnicFormat from "../../../cnicFormatter";

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
const NumberInput = ({ label, name, value, onChange, error }) => (
  <div style={{ marginBottom: "10px" }}>
    <label style={{ display: "block", marginBottom: "5px" }}>{label}:</label>
    <input
      type="number"
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
            border: "1px solid #A4243B",
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

const ClientRegistrationForm = () => {
  const [isUploading, setisUploading] = useState(false);
  const [usedId, setUsedId] = useState([]);
  const [AgentData, setAgentData] = useState({});
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
        GetAgentData(uid);
      } else {
        navigate("/login");
      }
    });
    getAllCustCnic();
  }, []);

  async function GetAgentData(id) {
    const docRef = doc(db, "Agent", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setAgentData(docSnap.data());
      setFormData((prevData) => ({
        ...prevData,
        ["agentId"]: id,
        ["agentName"]: docSnap.data().Name,
      }));
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      navigate("/login");
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
    if (usedId.includes(formData.Cnic)) {
      alert("Cnic Is Allready in used");
      return;
    }
    setErrors("");
    setisUploading(true);
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", formData);
      uploadToFirebase();
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
    // if (!data.phNo || !/^\d{15}$/.test(data.phNo)) {
    //   errors.phNo = "Phone No is required";
    // }
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
      errors.Dob = "Please enter you Dob";
    }
    console.log(errors);
    // Add more validation rules as needed

    return errors;
  };
  async function getAllCustCnic() {
    const querySnapshot = await getDocs(collection(db, "Customers"));
    let temp = [];
    querySnapshot.forEach((doc) => {
      temp.push(doc.id);
    });
    setUsedId(temp);
  }
  const isFormValid = Object.keys(errors).length === 0;

  const createClient = async () => {
    console.log("creating");
    await setDoc(doc(db, "Customers", formData.Cnic), {
      ...formData,
      ...{ createdAt: serverTimestamp() },
    });
    navigate(`/details/client/${formData.Cnic}`);
  };
  function uploadToFirebase() {
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
          createClient();
        });
      }
    );
  }

  return (
    <SideBar
      element={
        isUploading ? (
          <Loader />
        ) : (
          <>
            <div className="container">
              <h1 className="title-form" style={{ textAlign: "justify" }}>
                Registration Form
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
                        label="Father/Spouse Name"
                        name="FName"
                        value={formData.FName}
                        onChange={handleChange}
                        error={errors.FName}
                      />
                    </div>
                    <div className="input-box">
                      <NumberInput
                        label="CNIC"
                        name="Cnic"
                        value={formData.Cnic}
                        onChange={handleChange}
                        error={errors.Cnic}
                      />
                    </div>
                    <div className="input-box">
                      <NumberInput
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
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
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
                        <label
                          style={{ display: "block", marginBottom: "5px" }}
                        >
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
                      <NumberInput
                        label="Phone No"
                        name="PhNoKin"
                        value={formData.PhNoKin}
                        onChange={handleChange}
                        error={errors.PhNoKin}
                      />
                    </div>
                    <div className="input-box">
                      <NumberInput
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
        )
      }
    />
  );
};

export default ClientRegistrationForm;
