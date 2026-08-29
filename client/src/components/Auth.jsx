import { useState } from "react";

const API_URL = import.meta.env.DEV
    ? "http://localhost:5000"
    : "";
function Auth({ onLogin }) {
    const [mode, setMode] = useState("login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const endpoint =
                mode === "login"
                    ? "/api/auth/login"
                    : "/api/auth/signup";

            const body =
                mode === "login"
                    ? { email, password }
                    : { name, email, password };

            const response = await fetch(
                `${API_URL}${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(body)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong."
                );
            }

            onLogin(data.user);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Finance Dashboard</h1>

                <p>
                    {mode === "login"
                        ? "Login to manage your finances."
                        : "Create your personal finance account."}
                </p>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {mode === "signup" && (
                        <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : mode === "login"
                                ? "Login"
                                : "Create Account"}
                    </button>

                </form>

                <button
                    className="switch-auth"
                    onClick={() => {
                        setMode(
                            mode === "login"
                                ? "signup"
                                : "login"
                        );

                        setError("");
                    }}
                >
                    {mode === "login"
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Login"}
                </button>

            </div>

        </div>
    );
}

export default Auth;