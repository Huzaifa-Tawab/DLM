// src/EmployeeForm.js
import React, { useState } from 'react';
import './employeeform.css';

const EmployeeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    fname:'',
    qualification:'',
    dob:'',
    doj:'',
    age: '',
    health:'',
    address: '',
    email:'',
    mobno:'',
    fmobno:'',
    cnic:'',
    bankName: '',
    acctitle: '',
    iban:'',
    accountNumber: '',
    employmentStatus: '',
    undertaking: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'photo' && files && files[0]) {
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
        [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      });
    }
  };


  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Employee Details</title>');
    // Include your CSS styles here
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 100px;  /* Adjust the image size */
            height: 100px; /* Adjust the image size */
            border-radius: 50%;
            border: 2px solid #2980b9;
        }
        .section {
            margin: 20px 0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .section h2 {
            color: #2980b9;
        }
        .section p {
            margin: 5px 0;
        }
    `);
    printWindow.document.write('</style>');
    
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="header">');
    // Assuming formData.photo is the URL or base64 string for the employee photo
    printWindow.document.write(`<img src="${formData.photo}" alt="Employee Photo" />`);
    printWindow.document.write('<h1>Employee Details</h1>');
    printWindow.document.write('</div>');

    // Personal Details Section
    printWindow.document.write('<div class="section">');
    printWindow.document.write('<h2>Personal Details</h2>');
    printWindow.document.write(`<p><strong>Name:</strong> ${formData.name}</p>`);
    printWindow.document.write(`<p><strong>D.O.B:</strong> ${formData.dob}</p>`);
    printWindow.document.write(`<p><strong>Starting Date:</strong> ${formData.doj}</p>`);
    printWindow.document.write(`<p><strong>Medical History:</strong> ${formData.health}</p>`);
    printWindow.document.write(`<p><strong>Email:</strong> ${formData.email}</p>`);
    printWindow.document.write(`<p><strong>Phone No:</strong> ${formData.mobno}</p>`);
    printWindow.document.write(`<p><strong>Emergency No:</strong> ${formData.fmobno}</p>`);
    printWindow.document.write(`<p><strong>Address:</strong> ${formData.address}</p>`);
    printWindow.document.write('</div>');

    // Bank Information Section
    printWindow.document.write('<div class="section">');
    printWindow.document.write('<h2>Bank Information</h2>');
    printWindow.document.write(`<p><strong>Account Title:</strong> ${formData.acctitle}</p>`);
    printWindow.document.write(`<p><strong>IBAN:</strong> ${formData.iban}</p>`);
    printWindow.document.write(`<p><strong>Bank Name:</strong> ${formData.bankName}</p>`);
    printWindow.document.write(`<p><strong>Account Number:</strong> ${formData.accountNumber}</p>`);
    printWindow.document.write('</div>');

    // Employment Details Section
    printWindow.document.write('<div class="section">');
    printWindow.document.write('<h2>Employment Details</h2>');
    printWindow.document.write(`<p><strong>CNIC:</strong> ${formData.cnic}</p>`);
    printWindow.document.write(`<p><strong>Qualification:</strong> ${formData.qualification}</p>`);
    printWindow.document.write(`<p><strong>Father Name:</strong> ${formData.fname}</p>`);
    printWindow.document.write(`<p><strong>Age:</strong> ${formData.age}</p>`);
    printWindow.document.write(`<p><strong>Employment Status:</strong> ${formData.employmentStatus}</p>`);
    printWindow.document.write(`<p><strong>Undertaking:</strong> ${formData.undertaking ? 'Yes' : 'No'}</p>`);
    printWindow.document.write('</div>');

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
};


  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (if needed)
  };

  return (
    <div className="form-container">
      <h2>Employee Information Form</h2>
      <form onSubmit={handleSubmit}>
      <div className="input-group">
          <label>Image:</label>
          <input type="file" name="photo" value={formData.photo} onChange={handleChange} required />
          {isLoading && <p>Loading image...</p>}
        </div>
        <div className="input-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Father Name:</label>
          <input type="text" name="fname" value={formData.fname} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input type="text" name="email" value={formData.email} onChange={handleChange} required />
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
          <label>CNIC:</label>
          <input type="number" name="cnic" value={formData.cnic} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Qualification:</label>
          <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required />
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
          <label>Medical Report:</label>
          <input type="text" name="health" value={formData.health} onChange={handleChange} required />
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
          <label>IBAN:</label>
          <input type="text" name="iban" value={formData.iban} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Account Number:</label>
          <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
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
          <label>Starting Date:</label>
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
