import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

function ClientDetails() {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(true);
  const [userData, setData] = useState();
  const [Plots, setPlots] = useState([]);
  const prams = useParams();

  useEffect(() => {
    getdata();
  }, []);

  async function getdata() {
    const docRef = doc(db, "Customers", prams.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setData(docSnap.data());

      if (docSnap.data().Plots != null) {
        console.log("ok");
        getPlotsData(docSnap.data().Plots);
      }
      setisloading(false);
    }
  }

  async function getPlotsData(Plots) {
    console.log(Plots);
    var tempList = [];

    for (const plot_id in Plots) {
      const id = Plots[plot_id];

      const docRef = doc(db, "Plots", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        var temp = docSnap.data();
        temp["id"] = id;
        tempList.push(temp);
      }
    }

    setPlots(tempList);
  }

  return isloading ? (
    <Loader />
  ) : (
    <>
      <div className="ClientDetails">
        <div>
          <h1>User Information</h1>
          <ul>
            <li>
              <strong>Name:</strong> {userData.Name}
            </li>
            <li>
              <strong>Father's Name:</strong> {userData.FName}
            </li>
            <li>
              <strong>Gender:</strong> {userData.Gender}
            </li>
            <li>
              <strong>DOB:</strong> {userData.Dob}
            </li>
            <li>
              <strong>CNIC:</strong> {userData.Cnic}
            </li>
            <li>
              <strong>Phone Number:</strong> {userData.PhNo}
            </li>
            <li>
              <strong>Town City:</strong> {userData["Town City"]}
            </li>
            <li>
              <strong>Kin Relation:</strong> {userData.kinRelation}
            </li>
            <li>
              <strong>Next of Kin:</strong> {userData.nextOfKin}
            </li>
            <li>
              <strong>Address:</strong> {userData.Adress}
            </li>
            <li>
              <strong>Plots:</strong>
              {Plots.map((plot) => (
                <div key={plot.id}>{plot.id}</div>
              ))}
            </li>
            <li>
              <strong>Documents:</strong>
              <ul>
                {userData.Documents &&
                  Object.entries(userData.Documents).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong>
                      <a href={value} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </li>
                  ))}
              </ul>
            </li>
            <li>
              <strong>Image:</strong>
              <img
                src={userData.imgUrl}
                alt="User"
                style={{ maxWidth: "200px" }}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default ClientDetails;
