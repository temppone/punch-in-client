import { Navigate } from "react-router-dom";

interface IProtectedRoute {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: IProtectedRoute) => {
  const url = window.location.href;

  if (url.includes("access_token")) {
    localStorage.setItem("access_token", url.split("access_token=")[1]);
  }

  if (
    !localStorage.getItem("access_token") &&
    !localStorage.getItem("access_token")
  ) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
