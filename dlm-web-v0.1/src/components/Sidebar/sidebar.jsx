import React from "react";
import styled from "styled-components";
import SideBarButton from "./sidebarnavlinks";
import Logo from "./logo";

 const SideBarWrapper = styled.div`
 position: fixed;
 top: 0;
 left: 0;
 width: 250px;
 height: 100vh;
 display: block;
 z-index: 2;
 transition: transform 0.3s ease-in-out;
 @media (max-width:775px){
     transform: ${({open})=>(open ? "translateX(0%)" : "translateX(-102%)" )};
 }
 `;

 const SideBarBody = styled.div`
 background: linear-gradient(0deg, #3358f4, #1d8cf8);
 height: 100vh;
 overflow: hidden;
 @media (max-width:775px){
    box-shadow:0 16px 38px -12px rgba(0,0,0,0.56), 0 4px 25px 0 rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2);
}
 `;

 const Unorderlist = styled.ul`
 position: relative;
 list-style: none;
 padding: 0;
 display: block;
 transition: all 0.5s ease;
 `;

 const makeButtons = [
    {
        to: "dashboard/home",
        icon: <i className="fa-solid fa-house"></i>,
        title: "Dashboard"
    },
    {
        to: "dashboard/profile",
        icon: <i className="fa-solid fa-id-card"></i>,
        title: "Profile",
        subBtn: ["Passwords", "Mail", "Accounts"]
    },
    {
        to: "dashboard/features",
        icon: <i className="fa-solid fa-bag-shopping"></i>,
        title: "Features",
        subBtn: ["Pages", "Elements", "Portfolio"]
    },
    {
        to: "dashboard/revenue",
        icon: <i className="fa-solid fa-square-poll-vertical"></i>,
        title: "Revenue"
    },
    {
        to: "dashboard/analytics",
        icon: <i className="fa-solid fa-chart-pie"></i>,
        title: "Analytics"
    },
    {
        to: "dashboard/calendar",
        icon: <i className="fa-solid fa-calendar-days"></i>,
        title: "Calendar"
    },
    {
        to: "dashboard/messages",
        icon: <i className="fa-solid fa-comment"></i>,
        title: "Messages"
    },
    {
        to: "dashboard/wallets",
        icon: <i className="fa-solid fa-wallet"></i>,
        title: "Wallets",
        span: "New"
    },
    {
        to: "dashboard/content/settings",
        icon: <i className="fa-solid fa-gear"></i>,
        title: "Settings"
    }
 ]

 const SideBar = () => {
    return(
        <div>
            <SideBarWrapper>
                <SideBarBody>
                    <Logo/>
                <Unorderlist>
                {makeButtons.map((btn, i)=>(
                      <SideBarButton key={1} to={btn.to} icon={btn.icon} title={btn.title} span={btn.span} subBtn={btn.subBtn} 
                    //   handleClick={handleClick}
                      />
                ))}
                </Unorderlist>
                </SideBarBody>
            </SideBarWrapper>
        </div>
    );
 };
 export default SideBar;