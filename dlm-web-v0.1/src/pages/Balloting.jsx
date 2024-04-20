import React, { useState } from "react";
import arrow from "../Assets/Plus.png";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/Sidebar/sidebar";
import Loader from "../components/loader/Loader";
import Ballotingmodel from "../components/Modals/Ballotingmodel";
import Modal from "simple-react-modal";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

function Balloting() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [Title, setTitle] = useState("");
  const [Startdate, setStartDate] = useState("");
  const [Enddate, setEnddate] = useState("");

  //   setisLoading(false);
  const handleSubmit = (e) => {
    setisLoading(true);
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors == false) {
      uplaodToFirebase();
    } else {
      setisLoading(false);
    }
  };
  const validateForm = () => {
    let errors = false;
    if (Title === "") {
      alert("Please Enter Title");
      errors = true;
    }
    if (Startdate === "") {
      alert("Please Enter Start Date");
      errors = true;
    }
    if (Enddate === "") {
      alert("Please Enter End Date");
      errors = true;
    }

    return errors;
  };
  //   const datestart = {Startdate};
  // const [d, m, y] =  datestart.split(/-|\//); // splits "26-02-2012" or "26/02/2012"
  // const date = new Date(y, m - 1, d);
  // console.log(date.getTime());

  // const dateend = {Enddate};
  // const [date, month, year] =  dateend.split(/-|\//); // splits "26-02-2012" or "26/02/2012"
  // const date = new Date(year, month - 1, date);
  // console.log(date.getTime());

  async function uplaodToFirebase() {
    await addDoc(collection(db, "Balloting"), {
      title: Title,
      startDate: Startdate,
      endDate: Enddate,
      createdAt: Timestamp.now(),
    }).then(() => {
      setisLoading(false);
      alert("Balloting Uploaded");
    });
  }
  return (
    <>
      <SideBar
        element={
          isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="Admin-Home">
                <div className="hero--head">
                  <h1>Balloting</h1>
                  <button
                    onClick={() => {
                      setshowModal(true);
                    }}
                  >
                    Add New
                    <img src={arrow}></img>
                  </button>
                </div>
                <div className="Admin-Home-content">
                  <div className="Admin-Home-table">
                    <form className="nosubmit">
                      <input
                        type="text"
                        placeholder="Search by Id"
                        // onChange={(e) => debouncedFilterData(e.target.value)}
                        className="nosubmit"
                      />
                    </form>
                    <div className="table-wrapper">
                      <table className="fl-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {/* <td className="avatar-image width-adjust"> */}
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="tddr">
                              <p className="adress-finance-box"></p>
                            </td>
                            <td>
                              <button
                                className="button-view"
                                onClick={() => navigate(`/employe/`)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      />
      <Modal
        show={showModal}
        transitionSpeed={300}
        closeOnOuterClick={true}
        onClose={() => {
          setshowModal(false);
        }}
      >
        <div>
          <div
            className="popup-button"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingBottom: "30px",
            }}
          >
            <button
              style={{ background: "#fff" }}
              onClick={() => {
                setshowModal(false);
              }}
            >
              <i
                className="fa-solid fa-xmark"
                style={{ background: "#fff" }}
              ></i>
            </button>
          </div>
          <form className="bolating-form" onSubmit={handleSubmit}>
            <label>Title</label>
            <input
              type="text"
              value={Title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></input>
            <label>Start Date</label>
            <input
              type="date"
              value={Startdate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            ></input>
            <label>End Date</label>
            <input
              type="date"
              value={Enddate}
              onChange={(e) => {
                setEnddate(e.target.value);
              }}
            ></input>
            <input type="submit"></input>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default Balloting;
