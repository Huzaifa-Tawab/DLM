import React from "react";
import styled from "styled-components"
import { Link } from "react-router-dom";

const LogoWrapper = styled.div`
    width: 100%;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    > a {
        width: 100%;
        text-decoration: none;
        color: #fff;
        display: flex;
        align-items: center;
        > div {
            position: relative;
            width: 50px;
            height: 50px;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 15px 10px 0px;
            cursor: pointer;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50px;
            > i {
                font-size: 30px;
                color: #1d8bf8;
                margin-left: 2px;
            }
        }
    }
`;
const Logo = () => {
    return(
        <LogoWrapper>
            <Link to="dashboard/home">
                <div>
                    <i className="fa-brands fa-react"></i>
                </div>
                <h4>Salman Copying</h4>
            </Link>
        </LogoWrapper>
    )
}
export default Logo;