import { useState } from "react";

function TransactionForm({ onAdd }) {

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [type, setType] = useState("expense");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        const numericAmount = Number(amount);

        if (!title.trim() || numericAmount <= 0) {
            setError("Please enter a valid title and amount.");
            return;
        }

        setLoading(true);

        try {

            await onAdd({
                title: title.trim(),
                amount: numericAmount,
                category,
                type
            });

            setTitle("");
            setAmount("");
            setCategory("Food");
            setType("expense");

        } catch (error) {

            setError(
                error.message ||
                "Unable to add transaction."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <section className="form-section">

            <h2>Add Transaction</h2>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            <form
                className="transaction-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Transaction title"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                />

                <input
                    type="number"
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                        setAmount(event.target.value)
                    }
                />

                <select
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value)
                    }
                >
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Shopping</option>
                    <option>Entertainment</option>
                    <option>Bills</option>
                    <option>Education</option>
                    <option>Salary</option>
                    <option>Other</option>
                </select>

                <select
                    value={type}
                    onChange={(event) =>
                        setType(event.target.value)
                    }
                >
                    <option value="expense">
                        Expense
                    </option>

                    <option value="income">
                        Income
                    </option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Adding..."
                        : "Add Transaction"}
                </button>

            </form>

        </section>
    );
}

export default TransactionForm;