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
// import xIcon from "../../assets/Xincon.png";

function AddStoreItem({ showModal, onClose }) {
  const agentname = localStorage.getItem("Name");
  const agentid = localStorage.getItem("id");
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
      agentID: agentid,
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
      <h2>Add Items</h2>
      <span>Once you save the item it can't be edit or delete</span>
      <div className="closebutton">
        {/* <img onClick={onClose} src={xIcon} alt="" /> */}
      </div>
      <div>
        <div className="modal-field-group">
          <p>Name</p>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Office No</p>
          <input
            type="text"
            placeholder="Office No"
            onChange={(e) => {
              setOffice(e.target.value);
            }}
          />
        </div>
        <div className="modal-field-group">
          <p>Location</p>
          <textarea
            type="text"
            placeholder="Type your message"
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
        </div>

        <button
          className="modal-button"
          disabled={isLoading}
          onClick={handleUpload}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

export default AddStoreItem;
