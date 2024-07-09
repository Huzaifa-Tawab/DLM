import React, { useCallback, useMemo, useState } from "react";
import arrow from "../Assets/Plus.png";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/Sidebar/sidebar";
import Loader from "../components/loader/Loader";
import Ballotingmodel from "../components/Modals/Ballotingmodel";
import Modal from "simple-react-modal";
import {
  collection,
  addDoc,
  Timestamp,
  endAt,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import { debounce } from "lodash";
import { onAuthStateChanged } from "firebase/auth";

function Balloting() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const [Title, setTitle] = useState("");
  const [Startdate, setStartDate] = useState("");
  const [Enddate, setEnddate] = useState("");
  const [limit, setLimit] = useState(0);
  const [CustomersData, setCustomersData] = useState([]);
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.uid === "pjB7Lyyy6xMIim99mvbyUqjE1Op2") {
        
        } else {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

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
  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object
    return date.toLocaleDateString(); // Format date as desired (e.g., 'MM/DD/YYYY')
  };
  function toTimestamp(strDate) {
    var datum = Date.parse(strDate); //"Updated Firestore queries to include endAt parameter and added utility function to convert string date to Firebase Timestamp in Balloting.jsx"
    console.log(datum / 1000);
    return datum;
  }

  async function uplaodToFirebase() {
    await addDoc(collection(db, "Balloting"), {
      title: Title,
      limit:limit,
      startDate: Timestamp.fromMillis(toTimestamp(Startdate)), //"Updated Firestore queries to include endAt parameter and added utility function to convert string date to Firebase Timestamp in Balloting.jsx"
      endDate: Timestamp.fromMillis(toTimestamp(Enddate)),
      winners:[],
      submission:[],
      createdAt: Timestamp.now(),
    }).then(() => {
      setisLoading(false);
      alert("Balloting Uploaded");
    });
  }
  useEffect(() => {
    getCustomersData();
  }, []);
  async function getCustomersData() {
    //if we dont have search then we can get data by mapping this function name
    const querySnapshot = await getDocs(collection(db, "Balloting"));
    const newCustomersData = [];
    querySnapshot.forEach((doc) => {
      // newCustomersData.push(doc.data());
      newCustomersData.push({ ...doc.data(), id: doc.id });
    });
    setCustomersData(newCustomersData);
    setFilteredCustomersData(newCustomersData);
    setisLoading(false);
  }
  const filterData = useCallback(
    (searchText) => {
      let newData = CustomersData;
      if (searchText && searchText.length > 0) {
        newData = CustomersData.filter((data) =>
          data.title.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      setFilteredCustomersData(newData);
    },
    [CustomersData]
  );

  const debouncedFilterData = useMemo(
    () => debounce(filterData, 300),
    [filterData]
  );

  const filteredCustomersDataMemoized = useMemo(
    () => filteredCustomersData,
    [filteredCustomersData]
  );
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
                    {/* <form className="nosubmit">
                      <input
                        type="text"
                        placeholder="Search by Id"
                        // onChange={(e) => debouncedFilterData(e.target.value)}
                        className="nosubmit"
                      />
                    </form> */}
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
                          {filteredCustomersDataMemoized.map((data) => (
                            <tr key={data.id}>
                              {/* <td className="avatar-image width-adjust"> */}
                              <td>{data.title}</td>
                              <td>{formatTimestamp(data.startDate)}</td>
                              <td>{formatTimestamp(data.endDate)}</td>
                             <td>{data.winnerDeclared ? "Completed":"Pending"}</td>
                              <td>
                                <button
                                  className="button-view"
                                  onClick={() =>
                                    navigate(`/balloting/${data.id}`)
                                  }
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
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
             <label>Limit</label>
            <input
              type="text"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
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
