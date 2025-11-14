import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../app/auth/LoginPage.tsx";
import RegisterPage from "../app/auth/RegisterPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/auth/login",
        element: <LoginPage />,
    },
    {
        path: "/auth/register",
        element: <RegisterPage />,
    }
]);
