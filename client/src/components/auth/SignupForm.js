import { useContext } from "react";
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

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);

  return (
    <BoxContainer>
      <FormContainer>
        <Label>User Name</Label>
        <Input type="text" />
        <Marginer direction="vertical" margin={10} />
        <Label>Email</Label>
        <Input type="email" />
        <Marginer direction="vertical" margin={10} />
        <Label>Password</Label>
        <Input type="password" />
        <Marginer direction="vertical" margin={10} />
        <Label>Confirm Password</Label>
        <Input type="password" />
      </FormContainer>
      <Marginer direction="vertical" margin={20} />
      <SubmitButton type="submit">Signup</SubmitButton>
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
