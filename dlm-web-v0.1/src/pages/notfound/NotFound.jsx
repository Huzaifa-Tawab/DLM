import React from "react";
import "./notfound.css";
import notfound from "../../Assets/notfound.jpg"
function NotFound() {
  return <div className="not-found-sec">
    <div className="not-found-cont">
      <img src={notfound}></img>
      <h1 className="cont---head"> Your Account is Blocked</h1>
      <p className="cont---para">Please Contact with Admin</p>
    </div>







    </div>;
}

export default NotFound;
