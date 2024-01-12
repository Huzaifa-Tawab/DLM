import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { db } from "./src/firebase";

const generateRandomNumber = async (path) => {
  let randomPart = "";
  let isNotUnique = true;
  let ids = [];

  const querySnapshot = await getDocs(collection(db, path));
  querySnapshot.forEach((doc) => {
    ids.push(doc.id);
  });

  while (isNotUnique) {
    randomPart = Math.floor(Math.random() * 1000000) + 1;
    if (ids.includes(randomPart)) {
      isNotUnique = true;
    } else {
      isNotUnique = false;
    }
  }
  return `Dlm${randomPart}`;
};

export default generateRandomNumber;
