import React, { useState, useEffect } from "react";
import SideBar from "../../components/Sidebar/sidebar";
import "./dashboard.css"; // Import your CSS file for styling
import Loader from "../../components/loader/Loader";
import CommingSoon from "../Commingsoon";

function AdminDash() {
  const [isLoading, setisLoading] = useState(false);

  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
            <CommingSoon/>
          </>
        )
      }
    />
  );
}

export default AdminDash;

// <div className="agent-dash-head">
// <div className="dash-main-set">
//   <div className="client-pic">
//     <div className="client-pic-detail">
//       <img
//         className="avatar"
//         src={User.imgUrl}
//         alt="User"
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{ maxWidth: "100px" }}
//       />
//       <div className="cus-details">
//         <h2>{User.Name}</h2>
//         <h2>{User.Dob}</h2>
//         <h2>{User.Cnic}</h2>
//       </div>
//     </div>
//   </div>
//   <div className="level-cards">
//     <div className="box-level-record">
//       <h2>Level 1</h2>
//       {LevelOne.length}
//     </div>
//     <div className="box-level-record">
//       <h2>Level 2</h2>
//       {LevelTwo.length}
//     </div>
//     <div className="box-level-record">
//       <h2>Level 3</h2>
//       {LevelThree.length}
//     </div>
//     <div className="box-level-record">
//       <h2>Level 4</h2>
//       {LevelFour.length}
//     </div>
//   </div>
// </div>
// </div>
// <table>
// <thead>
//   <tr>
//     <th>Title</th>
//     <th>Prize</th>
//     <th>Target</th>
//     <th>Ends At</th>
//     <th>Remaining Hours</th>
//     <th>Total Amount</th>
//     <th>Status</th>
//   </tr>
// </thead>
// <tbody>
// {PromosWithStatus.map((promo, index) => (
//   <tr
//     key={index}
//     className={
//       promo.status === "completed" ? "goal-achieved" : ""
//     }
//   >
//     <td>{promo.title}</td>
//     <td>{promo.prize}</td>
//     <td>{promo.target}</td>
//     <td>{promo.endsAt.toDate().toLocaleString()}</td>
//     <td>{calculateRemainingHours(promo.endsAt.toDate())}</td>
//     <td>{promo.totalAmount}</td>
//     <td>{promo.status}</td>
//   </tr>
// ))}
// </tbody>
// </table>
// {User && <></>}
