import { useState } from "react";
import { useUser } from "../../contexts/user-context";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useUser();
    const [email, setEmail] = useState("user1@gmail.com");
    const [password, setPassword] = useState("password");
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
        } catch {
            setError("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-6xl bg-slate-950 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col lg:flex-row border border-slate-800">
                <div className="w-full lg:w-1/2 px-10 py-10 flex flex-col justify-between bg-slate-950">
                    <div>
                        <div className="flex items-center gap-2 mb-10">
                            <div className="w-6 h-6 rounded-full bg-blue-500" />
                            <span className="text-sm font-semibold text-slate-100">AlertFlow</span>
                        </div>
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base">
                                Sign in to access your monitoring ticket.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between text-xs md:text-sm text-slate-400">
                                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span>Remember me</span>
                                </label>
                            </div>

                            {error && (
                                <p className="text-xs text-red-400 text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 inline-flex justify-center items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.6)] hover:bg-blue-500 disabled:opacity-50"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-xs md:text-sm text-slate-500">
                        <span>Don't have an account? </span>
                        <button
                            type="button"
                            onClick={() => navigate("/auth/register")}
                            className="text-blue-400 font-medium hover:text-blue-300 hover:underline"
                        >Sign Up</button>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center p-8">
                    <div className="w-full h-full max-h-[460px] rounded-3xl bg-white/5 border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden flex items-center justify-center">
                        <img
                            src="https://www.placeholderimage.eu/api/800/600"
                            alt="Login illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}