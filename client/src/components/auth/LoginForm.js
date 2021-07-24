import { useContext, useState } from "react";
import axios from "axios";
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

export function LoginForm(props) {
  const { switchToSignup } = useContext(AccountContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const signinHandler = () => {
    // axios
    // .post(`http://localhost:5000/api/auth/login`, {
    //   email, password
    // })
    // .then((res) => {
    //   console.log(res);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
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
