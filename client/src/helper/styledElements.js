import styled from "styled-components";
import { motion } from "framer-motion";
import appMotoImageTrans from "./../assets/appMoto-transparent.png";

export const BoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

export const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.p`
  font-size: 11px;
  font-weight: 500;
  margin: 0px;
`;

export const BoldLink = styled.a`
  font-size: 14px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  margin: 0 4px;
  padding: 4px 6px 6px 6px;
  border-radius: 8px;
  background-color: teal;
`;

export const Input = styled.input`
  width: 100%;
  height: 38px;
  outline: none;
  border: 1.5px solid rgba(200, 200, 200, 0.3);
  border-radius: 4px;
  padding: 0px 10px;
  border-top: 1.5px solid transparent;
  border-bottom: 2px solid rgba(200, 200, 200, 0.3);
  background: rgba(242, 242, 242, 0.3);
  font-size: 14px;
  font-family: Segoe UI;

  &:focus {
    outline: none;
    border-bottom: 2px solid rgb(15, 205, 192);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 11px 40%;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 100px 100px 100px 100px;
  cursor: pointer;
  transition: all, 240ms ease-in-out;
  background: rgb(15, 205, 192);

  &:hover {
    background: rgb(12, 175, 169);
  }
`;

export const AuthContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: 850px) {
    flex-direction: column;
  }
`;

export const OuterBoxContainer = styled.div`
  width: 300px;
  min-height: 620px;
  display: flex;
  flex-direction: column;
  border-radius: 19px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
    0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
    0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
  position: relative;
  overflow: hidden;
  @media (max-width: 850px) {
    background-image: url(${appMotoImageTrans});
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: 340px 230px;
  }
`;

export const TopContainer = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em;
  padding-bottom: 5em;
`;

export const BackDrop = styled(motion.div)`
  width: 160%;
  height: 550px;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 50%;
  transform: rotate(60deg);
  top: -290px;
  left: -70px;
  background: rgb(12, 175, 169);
`;

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const HeaderText = styled.h2`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 10;
  margin: 0;
`;

export const SmallText = styled.h5`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  z-index: 10;
  margin: 0;
  margin-top: 7px;
`;

export const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.8em;
`;

export const backdropVariants = {
  expanded: {
    width: "233%",
    height: "1050px",
    borderRadius: "20%",
    transform: "rotate(60deg)",
  },
  collapsed: {
    width: "160%",
    height: "550px",
    borderRadius: "50%",
    transform: "rotate(60deg)",
  },
};

export const expandingTransition = {
  type: "spring",
  duration: 2.3,
  stiffness: 30,
};

export const ImageConatiner = styled.div`
  align-items: center;
  justify-content: center;
  @media (max-width: 850px) {
    display: none;
  }
`;

export const ImageText = styled.h1`
  font-size: 55px;
  padding-top: 5px;
  padding-left: 10px;
  font-weight: 800;
  color: teal;
  font-family: Georgia, serif; ;
`;
