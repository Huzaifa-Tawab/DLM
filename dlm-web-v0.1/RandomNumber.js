import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { db } from "./src/firebase";

const generateRandomNumber = async (path, prefix) => {
  let randomPart = "";
  let isNotUnique = true;
  let ids = [];

  if (path) {
    const querySnapshot = await getDocs(collection(db, path));
    querySnapshot.forEach((doc) => {
      ids.push(doc.id);
    });
  }

  while (isNotUnique) {
    randomPart = Math.floor(Math.random() * 1000000) + 1;
    if (ids.includes(prefix + randomPart)) {
      isNotUnique = true;
    } else {
      isNotUnique = false;
    }
  }
  return prefix + randomPart;
};

export default generateRandomNumber;
