import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function GetAgent() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      return uid;
    } else {
      // User is signed out
      return null;
    }
  });
}

export default GetAgent;
