import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import "./clientform.css";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import generateRandomString from "../../../RandomString";
import { getAuth } from "firebase/auth";

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

const AgentRegistrationForm = () => {
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
  });
  const [File, setFile] = useState();
  const [InvoiceID, setInvoiceID] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [Email, setEmail] = useState("");
  const [Pass, setPass] = useState("");

  useEffect(() => {
    const getInvId = async () => {
      const id = await generateRandomString("INV", "Agent", "");

      setInvoiceID(id);
    };
    getInvId();
  }, []);
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
    // e.preventDefault();
    // const validationErrors = validateForm(formData);
    // if (Object.keys(validationErrors).length === 0) {
    console.log("Form submitted:", formData);
    createUser();
    // } else {
    //   setErrors(validationErrors);
    // }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.Name.trim()) {
      errors.Name = "Name is required";
    }

    if (!data.FName.trim()) {
      errors.FName = "Father's Name is required";
    }

    if (!data.Cnic.trim()) {
      errors.Cnic = "CNIC is required";
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
    if (!Email) {
      errors.Email = "Please enter Email";
    }
    if (!Pass) {
      errors.Pass = "Please enter you Dob";
    }

    return errors;
  };

  const isFormValid = Object.keys(errors).length === 0;

  const createClient = async () => {
    await setDoc(doc(db, "Agent", formData.Cnic), formData);
    navigate(`/details/agent/${formData.Cnic}`);
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
  function createUser() {
    console.log("hello");
    auth
      .createUser({
        uid: formData.Cnic,
        email: Email,
        password: Pass,
      })
      .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
        // uploadToFirebase();
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
      });
  }

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="title" style={{ textAlign: "justify" }}>
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
                  label="Email"
                  name="Email"
                  value={Email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={errors.Email}
                />
              </div>
              <div className="input-box">
                <TextInput
                  label="Password"
                  name="Password"
                  value={Pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                  }}
                  error={errors.Pass}
                />
              </div>
              <div className="input-box">
                <TextInput
                  label="CNIC"
                  name="Cnic"
                  value={formData.Cnic}
                  onChange={handleChange}
                  error={errors.Cnic}
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
                <label for="dot-1">
                  <span class="dot one"></span>
                  <span class="gender">Male</span>
                </label>
                <label for="dot-2">
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
                disabled={!isFormValid}
                style={{ padding: "10px" }}
              >
                Save & Next
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AgentRegistrationForm;
