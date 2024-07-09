import React, { useEffect, useState } from "react";
import Modal from "simple-react-modal";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { update } from "lodash";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import getDate from "../../../GetDDMMYY";

function AddOffer({ showModal, onClose, uid,oid,listingId}) {
 
  const [Amount, setAmount] = useState(0);


  // useEffect(() => {}, []);
function handleSubmit(){
  if (Amount >200000) {
   addDoc(collection(db,"ListingOffers"), {
    Price: Amount,
    status:"pending",
    time:serverTimestamp(),
    uid:uid,
    listingId:listingId,
    Plot:oid,
   })
   onClose()
  }
  else{
    alert("Please enter a valid amount minimum amount is 200,000 PKR")
  }
}
  
  return (
    <Modal
      show={showModal}
      onClose={onClose}
      containerClassName="custom-modal-container"
      closeOnOuterClick={true}
    >
      <h2>Send Offer</h2>
      <div className="closebutton">
        {/* <img onClick={onClose} src={xIcon} alt="" /> */}
      </div>
      <div>
      <div className="modal-field-group">
          <p>Amount</p>
          <input onChange={(e)=>{setAmount(e.target.value)}} type="number" value={Amount} />
        </div>
        <button className="modal-button" onClick={handleSubmit}>Submit</button>

      </div>
    </Modal>
  );
}

export default AddOffer;
