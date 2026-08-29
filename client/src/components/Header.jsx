function Header({
    user,
    darkMode,
    setDarkMode,
    onLogout
}) {

    const logout = async () => {

        await fetch(
            "http://localhost:5000/api/auth/logout",
            {
                method: "POST",
                credentials: "include"
            }
        );

        onLogout();
    };


    return (

        <header className="header">

            <div>

                <h1>Finance Dashboard</h1>

                <p>
                    Welcome, {user.name}
                </p>

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

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </header>

    );
}

export default Header;