
import styled from "styled-components";
const HamWrapper=styled.div`
position:absolute;
top:20px;
right:15px;
cursor:pointer;
>i{
    font-size:18px;
    color:#fff
    margin-left:25px;    
}
@media (min-width:775px){
    display: none;
}
`;



const Ham=({open,handleClick})=>{
    return(
        <HamWrapper onClick={handleClick}>
            {open?(
                <i className="fas fa-align-center"></i>
            ):(
                <i className="fa-solid fa-bars"></i>
            )
            }

        </HamWrapper>

    );
};
export default Ham;
