import React, { useEffect, useState } from "react";
import "./walletnew.css";
import SideBar from "../../components/Sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import isAdmin from "../../../IsAdmin";
import arrow from "../../Assets/Plus.png";
import Widrawal from "../../components/Modals/widrawal";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import GetAgent from "../../getagent";
import { onAuthStateChanged } from "firebase/auth";
import getDate from "../../../GetDDMMYY";

function Wallet() {

}
export default Wallet;