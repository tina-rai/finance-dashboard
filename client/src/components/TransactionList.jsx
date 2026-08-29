import { useState } from "react";

function TransactionList({
    transactions,
    onDelete,
    onUpdate
}) {

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [editingId, setEditingId] = useState(null);

    const [editTitle, setEditTitle] = useState("");
    const [editAmount, setEditAmount] = useState("");

    const filteredTransactions = transactions
        .filter((transaction) =>
            transaction.title
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        .sort((a, b) => {

            if (sort === "amount-high") {
                return b.amount - a.amount;
            }

            if (sort === "amount-low") {
                return a.amount - b.amount;
            }

            return sort === "newest"
                ? new Date(b.date) - new Date(a.date)
                : new Date(a.date) - new Date(b.date);
        });

    const startEditing = (transaction) => {
        setEditingId(transaction.id);
        setEditTitle(transaction.title);
        setEditAmount(transaction.amount);
    };

    const saveEdit = (transaction) => {

        const amount = Number(editAmount);

        if (!editTitle.trim() || amount <= 0) {
            return;
        }

        onUpdate(transaction.id, {
            title: editTitle.trim(),
            amount
        });

        setEditingId(null);
    };

    return (
        <section className="transaction-section">

            <div className="section-header">

                <h2>Transactions</h2>

                <div className="transaction-controls">

                    <input
                        type="search"
                        placeholder="Search..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <select
                        value={sort}
                        onChange={(event) =>
                            setSort(event.target.value)
                        }
                    >
                        <option value="newest">
                            Newest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="amount-high">
                            Highest Amount
                        </option>

                        <option value="amount-low">
                            Lowest Amount
                        </option>
                    </select>

                </div>

            </div>

            {filteredTransactions.length === 0 ? (

                <p className="empty-message">
                    No transactions found.
                </p>

            ) : (

                <div className="transaction-list">

                    {filteredTransactions.map((transaction) => (

                        <div
                            className="transaction-item"
                            key={transaction.id}
                        >

                            {editingId === transaction.id ? (

                                <div className="edit-form">

                                    <input
                                        value={editTitle}
                                        onChange={(event) =>
                                            setEditTitle(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <input
                                        type="number"
                                        value={editAmount}
                                        onChange={(event) =>
                                            setEditAmount(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            saveEdit(transaction)
                                        }
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={() =>
                                            setEditingId(null)
                                        }
                                    >
                                        Cancel
                                    </button>

                                </div>

                            ) : (

                                <>
                                    <div>
                                        <strong>
                                            {transaction.title}
                                        </strong>

                                        <small>
                                            {transaction.category}
                                            {" • "}
                                            {new Date(
                                                transaction.date
                                            ).toLocaleDateString()}
                                        </small>
                                    </div>

                                    <strong>
                                        {transaction.type === "income"
                                            ? "+"
                                            : "-"}
                                        ${Number(transaction.amount).toFixed(2)}
                                    </strong>

                                    <div className="transaction-actions">

                                        <button
                                            onClick={() =>
                                                startEditing(transaction)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                onDelete(transaction.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </section>
    );
}

export default TransactionList;
