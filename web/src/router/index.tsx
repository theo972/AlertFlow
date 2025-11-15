import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../app/auth/LoginPage.tsx";
import RegisterPage from "../app/auth/RegisterPage.tsx";

export const router = createBrowserRouter([
    {
        element: <AuthOnly />,
        children: [
            { path: "/auth/login", element: <LoginPage /> },
            { path: "/auth/register", element: <RegisterPage /> },
        ],
    },
    {
        path: "/auth/register",
        element: <RegisterPage />,
    }
]);
