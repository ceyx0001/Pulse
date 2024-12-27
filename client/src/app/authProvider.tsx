import { Authenticator } from "@aws-amplify/ui-react";
import React from "react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
    },
  },
});

const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Enter your username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 1,
      placeholder: "Enter your email address",
      label: "Email",
      type: "email",
      isRequired: true,
    },
    password: {
      order: 1,
      placeholder: "Enter your password",
      label: "Password",
      type: "password",
      isRequired: true,
    },
    confirm_password: {
      order: 1,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      type: "password",
      isRequired: true,
    },
  },
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Authenticator formFields={formFields}>
      {({ user }) =>
        user ? (
          <div>{children}</div>
        ) : (
          <div>
            <h1>Please sign in below:</h1>
          </div>
        )
      }
    </Authenticator>
  );
};

export default AuthProvider;
