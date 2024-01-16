import React, { useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { update } from "lodash";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import "./modal.css";
function AddStoreItem({ showModal, onClose }) {
  const agentname = localStorage.getItem("Name");
  const [Title, setTitle] = useState("");
  const [Office, setOffice] = useState("");
  const [Desc, setDesc] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const handleUpload = () => {
    setisLoading(true);
    if (!Title.trim()) {
      alert("title");
      setisLoading(false);
    } else if (!Office.trim()) {
      setisLoading(false);
      alert("office");
    } else if (!Desc.trim()) {
      setisLoading(false);
      alert("decs");
    } else if (!agentname) {
      setisLoading(false);
      alert("Not Loged in Correctly try to re Login");
    } else {
      UpdateData();
    }
  };

  async function UpdateData() {
    await addDoc(collection(db, "Store"), {
      title: Title,
      office: Office,
      date: serverTimestamp(),
      decs: Desc,
      agent: agentname,
    });

    onClose();
    setisLoading(false);
  }
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
      closeOnOuterClick={!isLoading}
    >
      <h2>Add Store</h2>
      <button onClick={onClose}>Close Modal</button>
      <div>
        <div className="modal-field-group">
          <p>Title</p>
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Office</p>
          <input
            type="text"
            onChange={(e) => {
              setOffice(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Description</p>
          <textarea
            type="text"
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </div>

        <button disabled={isLoading} onClick={handleUpload}>
          Upload
        </button>
      </div>
    </Modal>
  );
}

export default AddStoreItem;
