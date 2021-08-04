import { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { LoginForm } from "./LoginForm";
import { motion } from "framer-motion";
import { AccountContext } from "./accountContext";
import { SignupForm } from "./SignupForm";
import AuthContext from "../../context/auth-context";
import appMotoImage from "../../assets/appMoto.PNG";

const AuthContainer = styled.div`
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

const BoxContainer = styled.div`
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
`;

const TopContainer = styled.div`
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 1.8em;
  padding-bottom: 5em;
`;

const BackDrop = styled(motion.div)`
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

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.h2`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.24;
  color: #fff;
  z-index: 10;
  margin: 0;
`;

const SmallText = styled.h5`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  z-index: 10;
  margin: 0;
  margin-top: 7px;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 1.8em;
`;

const backdropVariants = {
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

const expandingTransition = {
  type: "spring",
  duration: 2.3,
  stiffness: 30,
};

const ImageConatiner = styled.div`
  align-items: center;
  justify-content: center;
  @media (max-width: 850px) {
    display: none;
  }
`;

const ImageText = styled.h1`
  font-size: 55px;
  padding-top: 5px;
  padding-left: 10px;
  font-weight: 800;
  color: teal;
`;

const AppHeaderText = styled.h1`
  font-size: 35px;
  font-weight: 700;
  color: black;
  z-index: 10;
  margin: 0;
  display: none;

  @media (max-width: 850px) {
    display: block;
  }
`;

const Auth = (props) => {
  const { authenticated } = useContext(AuthContext);

  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState("signin");

  const playExpandingAnimation = () => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, expandingTransition.duration * 1000 - 1500);
  };

  const switchToSignup = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signup");
    }, 400);
  };

  const switchToSignin = () => {
    playExpandingAnimation();
    setTimeout(() => {
      setActive("signin");
    }, 400);
  };

  const contextValue = { switchToSignup, switchToSignin };

  return (
    <AuthContainer>
      <AccountContext.Provider value={contextValue}>
        <ImageConatiner>
          <ImageText>Collab-Board</ImageText>
          <img width="540px" height="330px" src={appMotoImage} />
        </ImageConatiner>
        {!authenticated ? (
          <BoxContainer>
            <TopContainer>
              <BackDrop
                initial={false}
                animate={isExpanded ? "expanded" : "collapsed"}
                variants={backdropVariants}
                transition={expandingTransition}
              />
              {active === "signin" && (
                <HeaderContainer>
                  {/* <AppHeaderText>Collab-Board</AppHeaderText> */}
                  <HeaderText>Welcome</HeaderText>
                  <HeaderText>Back</HeaderText>
                  <SmallText>Please sign-in to continue!</SmallText>
                </HeaderContainer>
              )}
              {active === "signup" && (
                <HeaderContainer>
                  {/* <AppHeaderText>Collab-Board</AppHeaderText> */}
                  <HeaderText>Create</HeaderText>
                  <HeaderText>Account</HeaderText>
                  <SmallText>Please sign-up to continue!</SmallText>
                </HeaderContainer>
              )}
            </TopContainer>
            <InnerContainer>
              {active === "signin" && <LoginForm />}
              {active === "signup" && <SignupForm />}
            </InnerContainer>
          </BoxContainer>
        ) : (
          <Redirect to="/user/profile" />
        )}
      </AccountContext.Provider>
    </AuthContainer>
  );
};

export default Auth;
