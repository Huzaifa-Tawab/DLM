import React, { useState, useEffect } from 'react';
import { doc, getDocs, updateDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './temp.css'
function TempToPlot() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch data from Firestore
  const fetchData = async () => {
    try {
      const plotsRef = collection(db, 'Plots');
      const querySnapshot = await getDocs(plotsRef);
      const fetchedFiles = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFiles(fetchedFiles);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Authentication check on component mount
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user || user.uid !== 'pjB7Lyyy6xMIim99mvbyUqjE1Op2') {
        navigate('/login');
      }
    });

    fetchData();
  }, [navigate]);

  // Convert to File
  const convertToFile = async (id) => {
    try {
      const fileRef = doc(db, 'Plots', id);
      await updateDoc(fileRef, { isNowPlot: false });
      fetchData();
    } catch (error) {
      console.error('Error converting to file:', error);
    }
  };

  // Convert to Plot
  const convertToPlot = async (id) => {
    const allotmentNumber = prompt('Please enter Plot Number', '001');

    if (!allotmentNumber) {
      alert('User cancelled the prompt.');
      return;
    }

    try {
      const fileRef = doc(db, 'Plots', id);
      await updateDoc(fileRef, {
        isNowPlot: true,
        plotAllotmentNo: allotmentNumber,
      });
      alert(`Allotment Number: ${allotmentNumber}`);
      fetchData();
    } catch (error) {
      console.error('Error converting to plot:', error);
    }
  };

  // Filter files based on search term
  const filteredFiles = files.filter((file) =>
    file.FileNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-container">
      <h1 className="management-title">File to Plot Management</h1>
      <div className="search-group">
        <input
          type="text"
          placeholder="Search by File Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="refresh-button" onClick={fetchData}>
          Refresh List
        </button>
      </div>
      <table className="management-table">
        <thead>
          <tr>
            <th>File Number</th>
            <th>Society</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <tr key={file.id}>
                <td>{file.FileNumber}</td>
                <td>{file.Society}</td>
                <td>
                  <span className={`status-badge ${file.isNowPlot ? 'status-plot' : 'status-file'}`}>
                    {file.isNowPlot ? 'Plot' : 'File'}
                  </span>
                </td>
                <td>
                  {file.isNowPlot ? (
                    <button className="action-button file-button" onClick={() => convertToFile(file.id)}>
                      Convert to File
                    </button>
                  ) : (
                    <button className="action-button plot-button" onClick={() => convertToPlot(file.id)}>
                      Convert to Plot
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data-message">
                No matching files found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TempToPlot;
