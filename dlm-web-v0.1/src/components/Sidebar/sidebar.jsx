import React, { useLayoutEffect, useState, useNavigate } from "react";
import styled from "styled-components";
import SideBarButton from "./sidebarnavlinks";
import Logo from "./logo";
import { useEffect } from "react";
import isAdmin from "../../../IsAdmin";
import {
  financeNavLinks,
  subAdminNavLinks,
  superAdminNavLinks,
} from "./navlinks";
import isFinance from "../../../IsFinance";
import isLogedIn from "../../../isLogedIn";

const SideBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  display: block;
  z-index: 2;
  transition: transform 0.3s ease-in-out;
  @media (max-width: 775px) {
    transform: ${({ open }) => (open ? "translateX(0%)" : "translateX(-100%)")};
  }
`;
const PageWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 250px;
  width: calc(100% - 250px);
  height: 100vh;
  display: block;
  z-index: 0;
  transition: transform 0.3s ease-in-out;
  @media (max-width: 775px) {
    transform: ${({ open }) => (open ? "translateX(0%)" : "translateX(-100%)")};
    left:34%;
  }
`;

const SideBarBody = styled.div`
  //   background: linear-gradient(0deg, #3358f4, #1d8cf8);
  background: #a4243b;
  height: 100vh;
  overflow: scroll;
  @media (max-width: 775px) {
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56),
      0 4px 25px 0 rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  }
`;

const Unorderlist = styled.ul`
  position: relative;
  list-style: none;
  padding: 0;
  display: block;
  transition: all 0.5s ease;
`;
const NegativeSidebar = styled.div`
 z-index:2;
 position:fixed;
 left:0;
 right:0;
 top:0;
 opacity:${({ open }) => (open ? "1" : "0")};
 transition:opacity 224ms cubic-bezier(0.4,0,0.2,1) 0ms;
 @media(max-width:775px){
    pointer-events:${({ open }) => (open ? "auto" : "none")};
 }
 @media(max-width:775px){
  background-color:none; 
  pointer-events:none;
 `;

const SideBar = ({ element }) => {
  const [navLinks, setnavLinks] = useState([]);
  useEffect(() => {
    getNavlinks();
  }, []);

  function getNavlinks() {
    if (isAdmin()) {
      setnavLinks(superAdminNavLinks);
    } else if (isFinance()) {
      setnavLinks(financeNavLinks);
    } else if (isLogedIn() && !isAdmin() && isFinance()) {
      //
    } else {
      setnavLinks(subAdminNavLinks);
    }
  }

  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth > 775) {
        // if (open === true) {
        //   setOpen(false);
        //   settest(false);
        // }
      }
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div>
      <NegativeSidebar open={true} onClick={() => {}} />
      <SideBarWrapper>
        <SideBarBody open={true}>
          <Logo />
          <Unorderlist>
            {navLinks.map((btn, i) => (
              <SideBarButton
                key={i}
                to={btn.to}
                icon={btn.icon}
                title={btn.title}
                span={btn.span}
                subBtn={btn.subBtn}
                handleClick={() => {}}
              />
            ))}
          </Unorderlist>
        </SideBarBody>
      </SideBarWrapper>
      <PageWrapper>{element}</PageWrapper>
    </div>
  );
};
export default SideBar;
