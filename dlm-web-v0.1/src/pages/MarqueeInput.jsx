import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Loader from "../components/loader/Loader";

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

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      <div>
        <button onClick={handleAddInput}>Add Input</button>
      </div>
      <ul>
        {inputList.map((input, index) => (
          <li key={index}>
            <input
              type="text"
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            <button onClick={() => handleRemoveInput(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={submitChanges}>Save</button>
    </div>
  );
};

export default MarqueeInput;
