import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import Loader from "../../components/loader/Loader";
import SideBar from "../../components/Sidebar/sidebar";
import './marquee.css'

const MarqueeInput = () => {
  const [inputList, setInputList] = useState([""]); // State to store the list of inputs
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    const getList = async () => {
      const docRef = doc(db, "constraints", "Super");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInputList(docSnap.data().Marquee);
        console.log(docSnap.data().Marquee);
      }
    };
    getList();
    setisLoading(false);
  }, []);

  const handleAddInput = () => {
    setInputList([...inputList, ""]);
  };

  const handleRemoveInput = (index) => {
    const newList = inputList.filter((_, i) => i !== index);
    setInputList(newList);
  };

  const handleInputChange = (index, value) => {
    const newList = [...inputList];
    newList[index] = value;
    setInputList(newList);
  };
  const submitChanges = async () => {
    setisLoading(true);
    const docRef = doc(db, "constraints", "Super");

    await updateDoc(docRef, {
      Marquee: inputList,
    });
    setisLoading(false);
  };

  return (
    <SideBar
    element={
      isLoading ? (
        <Loader/>
      ) : (
    <div className="marq-body">
      <div className="marq-add">
      </div>
      <div className="marq-input">
      {inputList.map((input, index) => (
          <div className="marquee" key={index}>
            <input
              type="text"
              placeholder="Write your marquee here"
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            <button onClick={() => handleRemoveInput(index)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="marq-add">
      <button onClick={handleAddInput}>Add New Promo</button>
      <button onClick={submitChanges}>Save</button>
      </div>
    </div>
   ) }/>
    
  );
};

export default MarqueeInput;
