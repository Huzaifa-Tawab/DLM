import React, {useState} from 'react'
import styled from "styled-components"
import { NavLink } from 'react-router-dom'

export const NavLinks = styled(NavLink)`
position: relative;
color: #fff;
padding: 15px 20px;
text-decoration: none;
display: flex;
align-items: center;
justify-content: left;
margin: 20px 10px;
border-radius: 10px;
&:hover{
    background: #ffffff24;
}
&.active {
    background: #ffff;
    color: #4297ff;
    trnsition: all 0.4s ease
}
`;

const Icon = styled.div`
margin-right; 14px;
font-size: 20px;
`;

const Newest = styled.div`
position: absolute;
right: 20px;
border-radius: 20px;
font-size: 12px;
font-weight: bold;
text-shadow: 2px 2px 5px rgb(0 0 0 / 91%);
`;

const NavBtn = styled.div`
position: relative;
color: #fff;
padding: 15px 20px;
text-decoration: none;
display: flex;
align-items: center;
justify-content: center;
margin: 40px 10px;
border-radius: 10px;
cursor: pointer;
backgroung: ${(props) => props.open && "#fff"};
&:hover {
    background: #ffffff24;
}
`;
const Arrow = styled.div`
position: absolute;
top: 50%;
right: 20px;
transform: translate(0, -50%);
> spna {
    display: inline-block;
    width; 0;
    height: 0;
    border-style: solid;
    bborder-width: 5px 0 5px 6px;
    border-color: transparent transparent transparent #fffffff;
    pointer-events: none;
    transform: ${(props) => (props.open ? "rotate(0deg)":"rotate(90deg)")};
    border-left: ${(props) => !props.open && "6px solid #ffff"};
}
`;
const SideBarButton = ({to, icon, title, span, subBtn, handleClick}) =>{
    const [openSubMenu, setopenSubMenu] = useState(false)

    const handleSubMenu = () => {
        if (subBtn !== undefined){
            setopenSubMenu(!openSubMenu);
        }
    };
  return (
    <li>
        {subBtn === undefined ? (
        <NavLinks
        strick= "true"
        to={{
            pathnaem: to,
            state: {flag: title}
        }}
        >
            <Icon>{icon}</Icon>
            {title}
            {span !== undefined && <Newest>{span}</Newest>}
        </NavLinks>
        ):(
            <NavBtn onClick={() => handleSubMenu()}>
                <Icon>{icon}</Icon>
                {title}
            {span !== undefined && <Newest>{span}</Newest>}
            {
                subBtn !== undefined && (
                    <Arrow open={!openSubMenu && "open"}>
                        <span></span>
                    </Arrow>
                )
            }
            </NavBtn>
        )}
    </li>
  )
}

export default SideBarButton