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
margin: 2px 10px;
border-radius: 10px;

&:hover{
    background:#ffffff24;
    color: #fff;
    text-decoration: none;
}
&:active {
    background: #fff;
    color: #4297ff;
    transition: all 0.4s ease;
  
}
`;

const Icon = styled.div`
margin-right:14px;
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
justify-content: left;
margin: 2px 10px;
border-radius: 10px;
cursor: pointer;
background: ${(props) => props.open && "#fff"};
&:hover {
    background: #ffffff24;
}
`;
const Arrow = styled.div`
position: absolute;
top: 50%;
right: 20px;
transform: translate(0, -50%);
> div {
    display: inline-block;
    width; 0;
    height: 0;
    border-style: solid;
    border-width: 5px 0 5px 6px;
    border-color: transparent transparent transparent #ddd;
    pointer-events: none;
    transform: ${(props) => (props.open ? "rotate(0deg)":"rotate(90deg)")};
    border-left: ${(props) => !props.open && "6px solid #ffff"};
    transition:all 0.2s;
}
`;
const SubMenu =styled.div`
display:flex;
flex-direction:column;
width:100%;
background:#00000029;
overflow:hidden;
height:${(props)=>(props.opened ==="true"? props.tall*59+20:0)}px;
transition:all 0.4s ease;
padding:${(props)=>(props.opened ==="true"?"10px 0px":"0px")};
margin:2px 0px 2px;

`;
const SubLinks=styled(NavLink)`
color: #fff;
padding:0px 20px;
height:55px !important;
text-decoration:none;
display: flex;
align-items: center;
justify-content: left;
margin: 2px 10px;
border-radius: 10px;
>div{
    margin-left:14px;   
}
&:hover{
    background:#ffffff24;
    color: #fff;
    text-decoration: none;
}
&:active{
    background:#fff;
    color:#4297ff;
    transition:all 0.4s ease;
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
            pathname: to,
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
                        <div></div>
                    </Arrow>
                )
            }
            </NavBtn>
        )}
        <SubMenu
           tall={`${subBtn !== undefined && subBtn.length}`}
           opened={openSubMenu ? "true":"false"}
           >
            {subBtn !==undefined &&
            subBtn.map((btn,i)=>( 
            <div key={i}>
                <SubLinks
                    key={i}
                    to={to +"/"+ btn.toLowerCase()}
                    onClick={handleClick}>
                        {btn.slice(0,2).toUpperCase()}
                        <div>{btn}</div>
                </SubLinks>
            </div>))}

           </SubMenu>
    </li>
  );
};

export default SideBarButton