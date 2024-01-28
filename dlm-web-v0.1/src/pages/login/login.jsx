import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Loader from "../../components/loader/Loader";
import Header from "../../components/header/Header";
import logo from "../../Assets/SoftXion.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState(null);
  const navi = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return false;
    }

    // You can add more specific validation if needed

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setisLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      console.log(uid);
      getUserType(uid);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);

      // Handle specific Firebase authentication errors
      switch (errorCode) {
        case "auth/user-not-found":
          setError("User not found. Please check your email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        default:
          setError("An error occurred. Please try again later.");
          break;
      }
    } finally {
      setisLoading(false);
    }
  };

  async function getUserType(id) {
    const docRef = doc(db, "Users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      localStorage.setItem("Name", docSnap.data().Name);
      localStorage.setItem("id", docSnap.id);
      localStorage.setItem("Type", docSnap.data().Type);

      switch (docSnap.data()["Type"]) {
        case "Admin":
          localStorage.setItem("Login", true);

          navi("/admin/home");
          break;
        case "SubAdmin":
          localStorage.setItem("Type", docSnap.data().Type);
          localStorage.setItem("Login", true);

          navi("/admin/home");

          break;
        case "finance":
          localStorage.setItem("Type", docSnap.data().Type);
          navi("/finance/");

          break;

        default:
          setError("Record Not Found");
          auth.signOut();
          localStorage.clear();
          break;
      }
      if (docSnap.data()["Type"] === "Admin") {
      }
    } else {
      console.log("No such document!");
      auth.signOut();

      setError("Record Not Found");
    }
  }

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="head-home">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="cta">
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      </div>
      <div className="Login-main">
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Email:
              <br />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </label>
            <br />
            <label>
              Password:
              <br />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </label>
            <br />
            {error && <div className="error-message">{error}</div>}
            <br />
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
