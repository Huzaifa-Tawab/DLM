import React, { useState, useEffect } from "react";
import SideBar from "../../components/Sidebar/sidebar";
import "./dashboard.css"; // Import your CSS file for styling
import Loader from "../../components/loader/Loader";
import CommingSoon from "../Commingsoon";

function FinanceDash() {
  const [isLoading, setisLoading] = useState(false);

  return (
    <SideBar
      element={
        isLoading ? (
          <Loader />
        ) : (
          <>
          <div className="agent-dash">
            <marquee
              className="news-slider"
              behavior="scroll"
              scrollamount="10"
              width="100%"
              direction="right"
              height="50px"
            >
              {Marquee}
            </marquee>
            <div className="agent-dash-content">
              <div className="agent-dash-content-col1">
                <div className="up-hd">
                  <h3>AGENT PROFILE</h3>
                </div>
                <div className="agent-dash-content-col1-row1 light-red">
                  <img src={User.imgUrl} className="dash-avatar" />
                  <div className="rower-fle">
                  <div className="rower">
                    <span><strong className="strong">Name:</strong></span>
                    <span><strong className="strong" >Gender:</strong></span>
                    <span><strong className="strong">CNIC:</strong></span>
                    <span><strong className="strong">Invoice Id:</strong> </span>
                    <span><strong className="strong">Sponsor of:</strong></span>
                  </div>
                  <div className="rower">
                    <span>{User.Name}</span>
                    <span>{User.Gender}</span>
                    <span>{User.Cnic}</span>
                    <span>{ChildOf.InvId}</span>
                    <span>{ChildOf.Name}</span>
                  </div>
                  <div className="rower">
                    <span><strong className="strong">F/H Name:</strong></span>
                    <span><strong className="strong">D.O.B:</strong></span>
                    <span><strong className="strong">Phone No:</strong></span>
                    <span><strong className="strong">TownCity:</strong></span>
                  </div>
                  <div className="rower">
                    <span>{User.FName}</span>
                    <span>{User.Dob}</span>
                    <span>{ChildOf.phNo}</span>
                    <span>{ChildOf.TownCity}</span>
                  </div>
                </div>
                </div>

                <div className="agent-dash-content-col1-row2">
                  <div className="agent-dash-content-col1-row2-card1 light-purple">
                    <div className="level-card">
                      <h1>Direct </h1>
                      <h1>{User.Plots.length} plots </h1>
                    </div>
                    <div className="level-card">
                      <h1>Level 1 </h1>
                      <h1>{LevelOne.length} persons </h1>
                    </div>
                    <div className="level-card">
                      <h1>Level 2 </h1>
                      <h1>{LevelTwo.length} persons </h1>
                    </div>
                    <div className="level-card">
                      <h1>Level 3 </h1>
                      <h1>{LevelThree.length} persons </h1>
                    </div>
                    <div className="level-card">
                      <h1>Level 4 </h1>
                      <h1>{LevelFive.length} persons </h1>
                    </div>
                  </div>
                  <div className="agent-dash-content-col1-row2-card2 light-blue">
                  <div className="level-card">
                      <h1>Plots </h1>
                      </div>
                    <ul >
                      {User.Plots.lenght === 0 ? (
                        <p>NO Plots</p>
                      ) : (
                        User.Plots.map((e) => <li>{e}</li>)

                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="agent-dash-content-col2 light-green">
                {PromosWithStatus &&
                  PromosWithStatus.map((promo, index) => (
                    //     promo.status === "completed" ? "goal-achieved" : ""

                    <div
                      key={index}
                      className={`agent-dash-content-col2-card ${promo.status === "completed" ? "goal-achieved" : ""
                        }`}
                    >
                      <div className="mymistake-huxi">
                        <div className="agent-dash-content-col2-card-content">
                          <h1>{promo.title}</h1>
                          <h3>Pts :{promo.totalAmount}</h3>
                          <h3>Target :{promo.target}</h3>
                        </div>
                        <div className="agent-dash-content-col2-card-progress">
                          <CircularProgressbar
                            className="progress-percent"
                            value={parseInt(promo.per)}
                            text={`${parseInt(promo.per)}%`}
                          />
                        </div>
                      </div>
                      <div className="flex-justify">
                        <h3>Prize:{promo.prize}</h3>
                        <h3>
                          {calculateRemainingHours(promo.endsAt.toDate())}hrs
                          left
                        </h3>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
        )
      }
    />
  );
}

export default FinanceDash;

