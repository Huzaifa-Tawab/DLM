import React, { useState } from 'react'
import styled from "styled-components"

const FooterWrapper = styled.div`
position: absolute;
bottom: 0;
width: 100%;
height: 80px;
-webkit-box-shadow: 0px -10px 14px -10px rgba(0, 0, 0, 0.22);
box-shadow: 0px -10px 14px -10px rgba(0, 0, 0, 0.22);
`;

const Footer = styled.div`
list-style: none;
margin: 0;
padding: 100px 0 0;
display: flex;
align-items: center;
justify-content: center;
font-weight: bold;
> li > a {
    text-decoration: none;
    color: #d8d8d8d;
    font-size: 12px;
    &:hover {
        color: #fff;
        transition: all 0.4s ease;
    }
}
> i {
    font-size: 4px;
    margin: 5px 5px 0 5px;
    color: #fffff45;
}
`;

const SubFooter = styled.div`
position: absolute;
bottom: 10px;
width: 100%;
display: flex;
justify-content: center;
color; #ffffff45;
font-size: 12px;
user-select: none;
cursor: default;
`;
const SidebarFotter = () => {
    const today = new Date();
    const [year] = useState(today.getFullYear());
  return (
    <FooterWrapper>
        <Footer>
            <li>
                <Link to="/dashboard/aboutus">About Us</Link>
            </li>
            <li>
                <i className="fa-solid fa-circle"></i>
            </li>
            <li>
                <Link to="/dashboardcontactus">Contact Us</Link>
            </li>
            <li>
            <i className="fa-solid fa-circle"></i>
            </li>
            <li>
                <Link to="/dashboard/legal">Legal</Link>
            </li>
        </Footer>
    </FooterWrapper>
  )
}

export default SidebarFotter