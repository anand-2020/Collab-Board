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
import AuthContext from "./../../context/auth-context";

export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const { updateAuthData } = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const signinHandler = () => {
    axios
      .post(`http://localhost:5000/api/auth/login`, {
        email,
        password,
      })
      .then((res) => {
        // change it to httpOnly cookie
        localStorage.setItem("jwt", res.data.jwt);
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
      </FormContainer>
      <Marginer direction="vertical" margin={30} />
      <SubmitButton onClick={signinHandler}>Signin</SubmitButton>
      <Marginer direction="vertical" margin={25} />
      <Label>
        Don't have an account?
        <BoldLink href="#" onClick={switchToSignup}>
          Signup
        </BoldLink>
      </Label>
    </BoxContainer>
  );
}
