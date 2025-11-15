import { createBrowserRouter } from "react-router-dom";
import { RequireAuth, AuthOnly } from "./auth-guards";
import LoginPage from "../app/auth/LoginPage.tsx";
import RegisterPage from "../app/auth/RegisterPage.tsx";
import DashboardPage from "../app/dashboard/DashboardPage.tsx";
import TicketsPage from "../app/tickets/TicketsPage.tsx";
import MainLayout from "../layouts/MainLayout.tsx";

export const router = createBrowserRouter([
    {
        element: <AuthOnly />,
        children: [
            { path: "/auth/login", element: <LoginPage /> },
            { path: "/auth/register", element: <RegisterPage /> },
        ],
    },
    {
        element: <RequireAuth />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: "/", element: <DashboardPage /> },
                    { path: "/tickets", element: <TicketsPage /> },
                ],
            },
        ],
    }
]);
