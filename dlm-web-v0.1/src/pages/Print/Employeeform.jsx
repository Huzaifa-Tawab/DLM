// src/EmployeeForm.js
import React, { useState } from 'react';
import './employeeform.css';
import dlmlogo from '../../Assets/sliderlogo.png';

const EmployeeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    fname: '',
    qualification: '',
    dob: '',
    doj: '',
    age: '',
    health: '',
    address: '',
    email: '',
    mobno: '',
    fmobno: '',
    cnic: '',
    bankName: '',
    acctitle: '',
    iban: '',
    accountNumber: '',
    employmentStatus: '',
    relation:'',
    designation: '',
    blood: '',
    allergy: '',
    undertaking: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file' && files && files[0]) {
      const file = files[0];

      if (file.size > 2 * 1024 * 1024) {
        alert('Please select a file smaller than 2MB.');
        return;
      }

      setIsLoading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          photo: reader.result, // Save the base64 string
        }));
        setIsLoading(false);
      };
      reader.readAsDataURL(file); // Convert image to base64
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee Details</title>
          <style>
            /* Set page size and styling for A4 printing */
            @page {
              size: A4;
              margin: 5mm;
            }
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f7f7f7;
            }
  
            /* General styling */
            .container {
              max-width: 210mm;
              margin: auto;
              
            }
            h1 {
              text-align: center;
              color: #f4b266;
              font-size: 20px;
              margin: 0;
              padding-bottom: 10px;
              border-bottom: 2px solid #f4b266;
            }
  
            /* Header */
            .header-logo {
              text-align: center;
            }
            .header-logo img {
              width: 200px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-direction: row-reverse;
            }
            .header img {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              border: 2px solid #a4243b;
              margin-right: 20px;
            }
  
            /* Section styling */
            .section {
            }
            .details-heading {
              color: #f4b266;
              font-size: 16px;
              border-bottom: 1px solid #a4243b;
              padding-bottom: 2px;
              margin: 3px 0px;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 14px;
            }
            .details-table td {
              padding: 6px;
              vertical-align: top;
              border: 1px solid #ddd;
            }
            .details-table .label {
              width: 35%;
              font-weight: bold;
              background: #f0f0f0;
              color: #555;
            }
            .details-table .value {
              width: 65%;
            }
  
            /* Footer styling */
            .footer {
              text-align: center;
            }
            .sign-section {
              display: flex;
              justify-content: space-around;
              margin-top: 80px;
            }
            .sign {
              width: 40%;
              text-align: center;
            }
            .sign hr {
              width: 80%;
              border-top: 1px solid #333;
              margin: auto;
            }
            .sign label {
              display: block;
              font-weight: bold;
              margin-top: 5px;
            }
            .computer-note {
              font-size: 12px;
              color: #888;
              text-align: left;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header-logo">
              <img src="${dlmlogo}" alt="Company Logo" />
            </div>
            <div class="header">
              <img src="${formData.photo}" alt="Employee Photo" />
              <h1>Employee Form</h1>
            </div>
            <div class="section">
              <h3 class="details-heading">Personal Details</h3>
              <table class="details-table">
                <tr><td class="label">Name:</td><td class="value">${formData.name}</td></tr>
                <tr><td class="label">Date of Birth:</td><td class="value">${formData.dob}</td></tr>
                <tr><td class="label">Age:</td><td class="value">${formData.age}</td></tr>
                <tr><td class="label">Email:</td><td class="value">${formData.email}</td></tr>
                <tr><td class="label">CNIC:</td><td class="value">${formData.cnic}</td></tr>
                <tr><td class="label">Phone No:</td><td class="value">${formData.mobno}</td></tr>
                <tr><td class="label">Qualification:</td><td class="value">${formData.qualification}</td></tr>
                <tr><td class="label">Address:</td><td class="value">${formData.address}</td></tr>
              </table>
            </div>
            <div class="section">
              <h3 class="details-heading">Bank Information</h3>
              <table class="details-table">
                <tr><td class="label">Account Title:</td><td class="value">${formData.acctitle}</td></tr>
                <tr><td class="label">Bank Name:</td><td class="value">${formData.bankName}</td></tr>
                <tr><td class="label">Account Number:</td><td class="value">${formData.accountNumber}</td></tr>
                <tr><td class="label">IBAN:</td><td class="value">${formData.iban}</td></tr>
              </table>
            </div>
            <div class="section">
              <h3 class="details-heading">Employment Details</h3>
              <table class="details-table">
                <tr><td class="label">Starting Date:</td><td class="value">${formData.doj}</td></tr>
                <tr><td class="label">Designation:</td><td class="value">${formData.designation}</td></tr>
                <tr><td class="label">Employment Status:</td><td class="value">${formData.employmentStatus}</td></tr>
                <tr><td class="label">Undertaking:</td><td class="value">${formData.undertaking ? 'Yes' : 'No'}</td></tr>
              </table>
            </div>
            <div class="section">
              <h3 class="details-heading">Medical Report</h3>
              <table class="details-table">
                <tr><td class="label">Medical Reports:</td><td class="value">${formData.health}</td></tr>
                <tr><td class="label">Blood Group:</td><td class="value">${formData.blood}</td></tr>
                <tr><td class="label">Known Allergies:</td><td class="value">${formData.allergy}</td></tr>
                
              </table>
            </div>
            <div class="section">
              <h3 class="details-heading">In case Of Emergency</h3>
              <table class="details-table">
                <tr><td class="label">Emergency Contact Name:</td><td class="value">${formData.fname}</td></tr>
                <tr><td class="label">Emergency Contact No:</td><td class="value">${formData.fmobno}</td></tr>
                <tr><td class="label">Relation to Employee:</td><td class="value">${formData.relation}</td></tr>
              </table>
            </div>
            <div class="footer">
              <div class="sign-section">
                <div class="sign">
                  <hr />
                  <label>Applicant's Signature</label>
                </div>
                <div class="sign">
                  <hr />
                  <label>CEO's Signature</label>
                </div>
              </div>
              
            </div>
            
          </div>
          <div class="computer-note">
                This document is computer-generated. Date: ${formData.doj}.
              </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  
  
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="form-container">
      <h2>Employee Information Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Image:</label>
          <input type="file" name="photo" onChange={handleChange} required />
          {isLoading && <p>Loading image...</p>}
        </div>
        <div className="input-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input type="text" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>CNIC:</label>
          <input type="number" name="cnic" value={formData.cnic} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>D.O.B:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Qualification:</label>
          <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Phone No:</label>
          <input type="text" name="mobno" value={formData.mobno} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Emergency No:</label>
          <input type="number" name="fmobno" value={formData.fmobno} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Emergency Contact Name:</label>
          <input type="text" name="fname" value={formData.fname} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Relation with Employee:</label>
          <input type="text" name="relation" value={formData.relation} onChange={handleChange} required />
        </div>
        
        
        
       
       
      
        <div className="input-group">
          <label>Medical Report:</label>
          <input type="text" name="health" value={formData.health} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Blood Group:</label>
          <input type="text" name="blood" value={formData.blood} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Known Allergies:</label>
          <input type="text" name="allergy" value={formData.allergy} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Bank Name:</label>
          <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Account Title:</label>
          <input type="text" name="acctitle" value={formData.acctitle} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Account Number:</label>
          <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>IBAN:</label>
          <input type="text" name="iban" value={formData.iban} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Employment Status:</label>
          <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="input-group">
          <label>Designation:</label>
          <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
        </div>
      
        <div className="input-group">
          <label>Joining Date:</label>
          <input type="date" name="doj" value={formData.doj} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>
            <input type="checkbox" name="undertaking" checked={formData.undertaking} onChange={handleChange} />
            I hereby declare that the above given information is true, complete and correct to the best of my knowledge and belief.
          </label>
        </div>
        <button type="button" onClick={handlePrint}>Print</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
