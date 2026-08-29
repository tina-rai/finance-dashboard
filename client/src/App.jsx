import { useEffect, useState } from "react";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Auth from "./components/Auth";

import "./App.css";

const API_URL = import.meta.env.DEV
    ? "http://localhost:5000"
    : "";

function App() {

    const [user, setUser] = useState(null);

    const [showAuth, setShowAuth] =
        useState(false);

    const [darkMode, setDarkMode] =
        useState(false);

    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    // Check existing login session
    useEffect(() => {

        fetch(`${API_URL}/api/auth/me`, {
            credentials: "include"
        })
            .then(async (response) => {

                if (!response.ok) {
                    return null;
                }

                return response.json();

            })
            .then((data) => {

                if (data?.user) {
                    setUser(data.user);
                }

            })
            .catch((error) => {

                console.error(
                    "Session check failed:",
                    error
                );

            })
            .finally(() => {

                setLoading(false);

            });

    }, []);


    // Load user's transactions
    useEffect(() => {

        if (!user) {
            setTransactions([]);
            return;
        }

        const loadTransactions = async () => {

            try {

                const response = await fetch(
                    `${API_URL}/api/transactions`,
                    {
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load transactions."
                    );

                }

                setTransactions(
                    data.transactions || []
                );

            } catch (error) {

                console.error(
                    "Transaction loading failed:",
                    error
                );

            }

        };

        loadTransactions();

    }, [user]);


    if (loading) {

        return (
            <div className="loading-page">
                Loading...
            </div>
        );

    }


    // Calculate USD totals
    const usdTransactions =
        transactions.filter(
            (transaction) =>
                transaction.currency === "USD"
        );

    const usdIncome =
        usdTransactions
            .filter(
                (transaction) =>
                    transaction.type === "income"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

    const usdExpenses =
        usdTransactions
            .filter(
                (transaction) =>
                    transaction.type === "expense"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

    const usdBalance =
        usdIncome - usdExpenses;


    // Calculate NPR totals
    const nprTransactions =
        transactions.filter(
            (transaction) =>
                transaction.currency === "NPR"
        );

    const nprIncome =
        nprTransactions
            .filter(
                (transaction) =>
                    transaction.type === "income"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

    const nprExpenses =
        nprTransactions
            .filter(
                (transaction) =>
                    transaction.type === "expense"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

    const nprBalance =
        nprIncome - nprExpenses;


    const handleLogin = (loggedInUser) => {

        setUser(loggedInUser);
        setShowAuth(false);

    };


    const handleLogout = async () => {

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

        setUser(null);
        setTransactions([]);

    };


    return (

        <div
            className={
                darkMode
                    ? "app dark"
                    : "app"
            }
        >

            <Header
                user={user}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onLogout={handleLogout}
            />


            <main className="dashboard">

                <SummaryCards
                    usdBalance={usdBalance}
                    usdIncome={usdIncome}
                    usdExpenses={usdExpenses}
                    nprBalance={nprBalance}
                    nprIncome={nprIncome}
                    nprExpenses={nprExpenses}
                />


                {!user && (

                    <section className="guest-section">

                        <h2>Track your finances</h2>

                        <p>
                            Add income and expenses to keep
                            your finances organized.
                        </p>

                        <button
                            className="add-transaction-button"
                            onClick={() =>
                                setShowAuth(true)
                            }
                        >
                            Add Transaction
                        </button>

                    </section>

                )}


                {user && (

                    <TransactionForm
                        onAdd={async (transaction) => {

                            const response =
                                await fetch(
                                    `${API_URL}/api/transactions`,
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        credentials:
                                            "include",

                                        body:
                                            JSON.stringify(
                                                transaction
                                            )
                                    }
                                );

                            const data =
                                await response.json();

                            if (!response.ok) {

                                throw new Error(
                                    data.message ||
                                    "Unable to add transaction."
                                );

                            }

                            setTransactions(
                                (current) => [
                                    data.transaction,
                                    ...current
                                ]
                            );

                        }}
                    />

                )}


                <TransactionList
                    transactions={transactions}

                    onDelete={async (id) => {

                        const response =
                            await fetch(
                                `${API_URL}/api/transactions/${id}`,
                                {
                                    method: "DELETE",
                                    credentials:
                                        "include"
                                }
                            );

                        if (response.ok) {

                            setTransactions(
                                (current) =>
                                    current.filter(
                                        (transaction) =>
                                            transaction.id !== id
                                    )
                            );

                        }

                    }}

                    onUpdate={async (
                        id,
                        updatedTransaction
                    ) => {

                        const response =
                            await fetch(
                                `${API_URL}/api/transactions/${id}`,
                                {
                                    method: "PUT",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    credentials:
                                        "include",

                                    body:
                                        JSON.stringify(
                                            updatedTransaction
                                        )
                                }
                            );

                        const data =
                            await response.json();

                        if (response.ok) {

                            setTransactions(
                                (current) =>
                                    current.map(
                                        (transaction) =>
                                            transaction.id === id
                                                ? data.transaction
                                                : transaction
                                    )
                            );

                        }

                    }}
                />

            </main>


            {showAuth && (

                <div className="auth-modal">

                    <div className="auth-modal-content">

                        <button
                            className="auth-modal-close"
                            onClick={() =>
                                setShowAuth(false)
                            }
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <Auth
                            onLogin={handleLogin}
                        />

                    </div>

                </div>

            )}

        </div>

    );
}

export default App;