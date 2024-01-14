import { collection, getDocs } from "firebase/firestore";
import { db } from "./src/firebase";

const generateRandomString = async (key, path, prefix) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  let isNotUnique = true;
  let ids = [];
  const querySnapshot = await getDocs(collection(db, path));
  querySnapshot.forEach((doc) => {
    ids.push(doc.data().key);
  });
  while (isNotUnique) {
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    if (ids.includes(prefix + result)) {
      isNotUnique = true;
    } else {
      isNotUnique = false;
    }
  }
  return prefix + result;
};

export default generateRandomString;
