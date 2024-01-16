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
              <h1>Customer Information</h1>

              <img
                className="avatar"
                src={userData.imgUrl}
                alt="User"
                style={{ maxWidth: "200px" }}
              />
              <br />
              <span>info@infogmail.com</span>
              <br />
              <span>+92 317 5545690</span>
              <div className="clients-buttons">
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
                <button>
                  <img src={edit} alt="" />
                  <p>Edit </p>
                </button>
                <button>
                  <img src={edit} alt="" />
                  <p>Edit </p>
                </button>
              </div>
            </div>
            <div className="info-box-2">
              <h1>Other Details</h1>
              <div className="data-client">
                <div className="row">
                  <h2> Name: {userData.Name}</h2>
                  <h2> Father's Name: {userData.FName}</h2>
                </div>
                <div className="row">
                  <h2> Gender: {userData.Gender}</h2>
                  <h2>DOB: {userData.Dob}</h2>
                </div>
                <div className="row">
                  <h2> CNIC:{userData.Cnic}</h2>
                  <h2> Phone Number:{userData.phNo}</h2>
                </div>
                <div className="row">
                  <h2> Town City:{userData["TownCity"]}</h2>
                  <h2> Kin Relation:{userData.KinRelation}</h2>
                </div>
                <div className="row">
                  <h2> Next of Kin:{userData.NexttoKin}</h2>
                  <h2> Address:{userData.Address}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="documents">
            <h1>Documents</h1>
            {userData.Documents &&
              Object.entries(userData.Documents).map(([key, value]) => (
                <h2 className="doc-align" key={key}>
                  <h2>{key}</h2>
                  <a href={value} target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </h2>
              ))}
          </div>
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
