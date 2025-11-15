import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./contexts/user-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./styles/index.scss";
import "./styles/theme.scss";

const qc = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={qc}>
            <UserProvider>
                <App />
            </UserProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
