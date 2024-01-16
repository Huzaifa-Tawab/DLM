import React, { useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { update } from "lodash";
import { doc, updateDoc } from "firebase/firestore";
import "./modal.css";
function AddDocs({ showModal, onClose, uid, olddocs }) {
  console.log(olddocs);
  // State to store uploaded file
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  // progress
  const [percent, setPercent] = useState(0);

  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const handleUpload = () => {
    if (!file) {
      alert("Please upload an image first!");
    }

    if (olddocs.hasOwnProperty(fileName)) {
      alert(`${fileName} already exists`);
    } else {
      uploadToFirebase();
    }
  };
  function uploadToFirebase() {
    const storageRef = ref(storage, `/Documents/${uid}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          olddocs[fileName] = url;
          UpdateData(olddocs);
        });
      }
    );
  }
  async function UpdateData(docs) {
    console.log("cnic", uid);
    const Documents = doc(db, "Customers", uid);

    // Set the "capital" field of the city 'DC'
    console.log("Docs", docs);
    await updateDoc(Documents, {
      Documents: docs,
    }).then((e) => {
      console.log("red", e);
    });
    // onClose();
  }
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
      closeOnOuterClick={true}
    >
      <h2>Add Document</h2>
      <button onClick={onClose}>Close Modal</button>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setFileName(e.target.value);
          }}
        />
        <input type="file" onChange={handleChange} accept="/image/*" />
        <button onClick={handleUpload}>Upload to Firebase</button>
        <p>{percent} "% done"</p>
      </div>
    </Modal>
  );
}

export default AddDocs;
