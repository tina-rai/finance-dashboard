
const API_URL = import.meta.env.DEV
    ? "http://localhost:5000"
    : "";

function Header({
    user,
    darkMode,
    setDarkMode,
    onLogout
}) {

    const logout = async () => {

        try {

            await fetch(
                `${API_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

        }

        onLogout();
    };


    return (

        <header className="header">

            <div>

                <h1>Finance Dashboard</h1>

                {user ? (

                    <p>
                        Welcome, {user.name}
                    </p>

                ) : (

                    <p>
                        Manage your finances with ease.
                    </p>

                )}

            </div>


            <div className="header-actions">

                <button
                    className="theme-button"
                    onClick={() =>
                        setDarkMode(!darkMode)
                    }
                >
                    {darkMode
                        ? "☀️ Light Mode"
                        : "🌙 Dark Mode"}
                </button>


                {user && (

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                )}

            </div>

        </header>

    );

}

export default Header;
