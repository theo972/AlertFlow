import { useQuery } from "@tanstack/react-query";
import { api, metrics } from "./api";

export default function App() {
    const reports = useQuery({
        queryKey: ["reports"],
        queryFn: async () => (await api.get("/reports?size=10")).data,
    });

    const summary = useQuery({
        queryKey: ["metrics","summary"],
        queryFn: async () => (await metrics.get("/health")).data,
    });

    return (
        <main style={{padding:16, fontFamily:"Inter, system-ui, Arial"}}>
            <h1>AlertFlow</h1>
            <h2>Reports</h2>
            <pre>{JSON.stringify(reports.data ?? {data:[]}, null, 2)}</pre>
            <h2>Analytics health</h2>
            <pre>{JSON.stringify(summary.data ?? {}, null, 2)}</pre>
        </main>
    );
}