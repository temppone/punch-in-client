import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoadingContextProvider } from "./contexts/LoadingContext";
import { UserContextProvider } from "./contexts/UserContext";
import "./index.css";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/ProtectedRoute";
import Reports from "./pages/Reports";
import SignIn from "./pages/SignIn";
import Root from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { path: "/home", element: <ProtectedRoute children={<Home />} /> },
      {
        path: "/relatorios",
        element: <ProtectedRoute children={<Reports />} />,
      },
    ],
  },

  {
    path: "/sign-in",
    errorElement: <NotFound />,
    element: <SignIn />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <LoadingContextProvider>
        <UserContextProvider>
          <RouterProvider router={router} />
        </UserContextProvider>
      </LoadingContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
