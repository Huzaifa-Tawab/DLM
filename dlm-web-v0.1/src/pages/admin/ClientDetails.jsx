import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./clientdetails.css";
import avatar from "../../assets/avatar.png";
import edit from "../../assets/edit.png";
import Header from "../../components/header/Header";
import Footer from "../../components/Footer/Footer";
import AddDocs from "../../components/Modals/AddDocs";
import { PiBuildingsBold } from "react-icons/pi";
import isAdmin from "../../../IsAdmin";
function ClientDetails() {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(true);
  const [userData, setData] = useState();
  const [Plots, setPlots] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [UserDocs, setUseDocs] = useState({});

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
        setUseDocs(docSnap.data().Document);
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
  const openDocModal = () => {
    setShowDocModal(true);
  };

  const closeDocModal = () => {
    setShowDocModal(false);
  };
  return isloading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <div className="ClientDetails">
        <div>
          <div className="info-box">
            <div className="client-pic">
              {/* <h1>Customer Information</h1> */}
              <div className="client-pic-detail">
                <img
                  className="avatar"
                  src={userData.imgUrl}
                  alt="User"
                  style={{ maxWidth: "100px" }}
                />
                <div className="cus-details">
                  <h2>Ahmed</h2>
                  <span>Customer</span>
                </div>
              </div>
              <br />
              <span>info@infogmail.com</span>
              <br />
              <span>+92 317 5545690</span>
              <div className="clients-buttons">
                <div className="button-pair">
                  <button onClick={openDocModal}>
                    <img src={edit} alt="" />
                    <p>Add Doc </p>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/create/plot/", {
                        state: {
                          Cuid: userData.Cnic,
                        },
                      });
                    }}
                  >
                    <img src={edit} alt="" />
                    <p>Add Plot </p>
                  </button>
                </div>
                {isAdmin() &&   <div className="button-pair">
                  <button>
                    <img src={edit} alt="" />
                    <p>Edit Profile </p>
                  </button>
                  <button>
                    <img src={edit} alt="" />
                    <p>Delete Profile</p>
                  </button>
                </div>}
              </div>
            </div>
            <div className="info-box-2">
              <h1>Customer Information</h1>
              <div className="data-client">
                <div className="row">
                  <h2>
                    <span>Name:</span> {userData.Name}
                  </h2>
                  <h2>
                    <span>Father's Name:</span> {userData.FName}
                  </h2>
                </div>
                <div className="row">
                  <h2>
                    <span>Gender:</span> {userData.Gender}
                  </h2>
                  <h2>
                    <span>DOB:</span> {userData.Dob}
                  </h2>
                </div>
                <div className="row">
                  <h2>
                    <span>CNIC:</span> {isAdmin() && userData.Cnic }
                  </h2>
                  <h2>
                    <span>Phone Number:</span> {userData.phNo}
                  </h2>
                </div>
                <div className="row">
                  <h2>
                    <span>Town City:</span>
                    {userData["TownCity"]}
                  </h2>
                  <h2>
                    <span>Kin Relation:</span>
                    {userData.KinRelation}
                  </h2>
                </div>
                <div className="row">
                  <h2>
                    <span>Next of Kin:</span> {userData.NexttoKin}
                  </h2>
                  <h2>
                    <span>Address:</span> {userData.Address}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {isAdmin() && <div className="documents">
            <div className="doc-row">
              <h1>Documents</h1>
              <button>Add Document</button>
            </div>
            <table>
              <thead>
                <th>Title</th>
                <th>Uploaded At</th>
                <td>Acitons</td>
              </thead>
              <tbody>
                {userData.Documents &&
                  Object.entries(userData.Documents).map(([key, value]) => (
                    <tr>
                      <td>{key}</td>
                      <td>---</td>
                      <td>
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          view
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div> }          
          <div className="plots">
            <h1>Plots Details</h1>
            <div className="plot-cards">
              {Plots.map(
                (plot) => (
                  console.log(plot),
                  (
                    <div className="card">
                      <h2>{plot.id}</h2>

                      <div className="plot-des"></div>

                      <div className="row-start">
                        <PiBuildingsBold className="buildlogo" />
                        <span>Category :</span>
                        <h2>{plot.Category}</h2>
                      </div>

                      <div className="view-more">
                        <button
                          onClick={() => {
                            navigate(`/details/plot/${plot.id}`);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <AddDocs
        showModal={showDocModal}
        onClose={closeDocModal}
        olddocs={userData.Documents}
        uid={userData.Cnic}
      />
    </>
  );
}

export default ClientDetails;
