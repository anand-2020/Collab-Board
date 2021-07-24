import styled from "styled-components";

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
  color: grey;
  font-weight: 500;
  margin: 0px;
`;

export const BoldLink = styled.a`
  font-size: 14px;
  color: rgb(15, 205, 192);
  font-weight: 600;
  text-decoration: none;
  margin: 0 4px;
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
