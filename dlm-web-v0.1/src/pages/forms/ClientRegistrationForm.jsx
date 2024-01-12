import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

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

const CheckboxInput = ({ label, name, checked, onChange }) => (
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
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div style={{ marginBottom: "10px" }}>
    <label style={{ display: "block", marginBottom: "5px" }}>{label}:</label>
    <input type="file" name={name} onChange={onChange} />
  </div>
);
// ... (previous imports)

const ClientRegistrationForm = () => {
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
    agree: false,
    imgUrl: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

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
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted:", formData);
      createClient();
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

    if (!data.Cnic.trim()) {
      errors.Cnic = "CNIC is required";
    }

    // Add more validation rules as needed

    return errors;
  };

  const isFormValid = Object.keys(errors).length === 0;

  const createClient = async () => {
    await setDoc(doc(db, "Customers", formData.Cnic), formData);
    navigate(`/details/client/${formData.Cnic}`);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <FileInput
          label="Upload Profile Image"
          name="imgUrl"
          onChange={handleChange}
        />

        <TextInput
          label="Name"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          error={errors.Name}
        />

        <TextInput
          label="Father's Name"
          name="FName"
          value={formData.FName}
          onChange={handleChange}
          error={errors.FName}
        />

        <TextInput
          label="CNIC"
          name="Cnic"
          value={formData.Cnic}
          onChange={handleChange}
          error={errors.Cnic}
        />

        <TextInput
          label="Phone Number"
          name="phNo"
          value={formData.phNo}
          onChange={handleChange}
        />

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Gender:
          </label>
          <RadioInput
            label="Male"
            name="Gender"
            value="male"
            checked={formData.Gender === "male"}
            onChange={handleChange}
          />
          <RadioInput
            label="Female"
            name="Gender"
            value="female"
            checked={formData.Gender === "female"}
            onChange={handleChange}
          />
        </div>

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
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Address:
          </label>
          <textarea
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          ></textarea>
        </div>

        <TextInput
          label="City/Town"
          name="TownCity"
          value={formData.TownCity}
          onChange={handleChange}
        />

        <TextInput
          label="Next of Kin"
          name="NexttoKin"
          value={formData.NexttoKin}
          onChange={handleChange}
        />

        <TextInput
          label="Relation with Kin"
          name="KinRelation"
          value={formData.KinRelation}
          onChange={handleChange}
        />

        <CheckboxInput
          label="I agree"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
        />

        <a href={"/pdfs/sample.pdf"}>Download</a>

        <div>
          <button
            type="submit"
            disabled={!isFormValid}
            style={{ padding: "10px" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientRegistrationForm;
