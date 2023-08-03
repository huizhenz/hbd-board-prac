import React, { useState } from "react";
import { Layout, Button } from "antd";
import styled from "styled-components";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

const { Content } = Layout;

const AuthMain: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleGoToLogin = () => {
    setIsLogin(true);
  };

  const handleGoToSignup = () => {
    setIsLogin(false);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <Logo>HBD</Logo>
          {isLogin ? <LoginForm /> : <SignupForm setIsLogin={setIsLogin} />}
          <Button
            type="link"
            onClick={isLogin ? handleGoToSignup : handleGoToLogin}
          >
            {isLogin ? "회원가입으로 이동" : "로그인으로 이동"}
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthMain;

const Logo = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  color: #1890ff;
`;
