import { useContext, useState } from "react";
import axios from "axios";
import socketio from "socket.io-client";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  Label,
  SubmitButton,
} from "./../../helper/styledElements";
import { Marginer } from "./../../helper/marginer";
import { AccountContext } from "./accountContext";
import AuthContext from "../../context/auth-context";
import SocketContext from "../../context/socket-context";

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);
  const { updateAuthData } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [handle, setHandle] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const signupHandler = () => {
    axios
      .post(`http://localhost:5000/api/auth/signup`, {
        handle,
        email,
        password,
      })
      .then((res) => {
        // change it to httpOnly cookie
        localStorage.setItem("jwt", res.data.jwt);
        // disconnect previous un-authenticated socket
        if (socket) socket.disconnect();
        const connection = socketio.connect("http://localhost:5000/", {
          query: { token: localStorage.getItem("jwt") },
        });

        updateAuthData(true, res.data.data.user, connection);
      })
      .catch((err) => {
        window.alert(err.response.data.message);
        updateAuthData(false, null, null);
      });
  };

  return (
    <BoxContainer>
      <FormContainer>
        <Label>Handle</Label>
        <Input
          type="text"
          onChange={(e) => {
            setHandle(e.target.value);
          }}
        />
        <Marginer direction="vertical" margin={10} />
        <Label>Email</Label>
        <Input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Marginer direction="vertical" margin={10} />
        <Label>Password</Label>
        <Input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Marginer direction="vertical" margin={10} />
        <Label>Confirm Password</Label>
        <Input
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        />
      </FormContainer>
      <Marginer direction="vertical" margin={20} />
      <SubmitButton onClick={signupHandler}>Signup</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <Label>
        Already have an account?
        <BoldLink href="#" onClick={switchToSignin}>
          Signin
        </BoldLink>
      </Label>
    </BoxContainer>
  );
}
