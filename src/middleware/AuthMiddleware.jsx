import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "./../context/UserAuthContextProvider";
import { useEffect } from "react";
import PageLoader from './../components/loaders/PageLoader';

function AuthMiddleware({ children }) {
  let { user, loading } = useUserAuth();

  useEffect(() => {}, []);

  if (loading) {
    return <PageLoader/>;
  } else {
    if (!user) {
      return <Navigate to="/" />;
    }
  }
  return children;
}

export default AuthMiddleware;
