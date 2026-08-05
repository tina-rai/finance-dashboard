function renderTransactions() {

    transactionList.innerHTML = "";

    const transactions =
        getTransactions();

    transactions.forEach(transaction => {

        const card =
            document.createElement("div");

        card.className = "transaction-card";

        card.innerHTML = `

            <h3>${transaction.title}</h3>

            <p>
                ${transaction.category}
            </p>

            <strong>

                ${transaction.type === "income"
                    ? "+"
                    : "-"}

                Rs. ${transaction.amount}

            </strong>

        `;

        transactionList.appendChild(card);

    });
    updateSummary();

}

function updateSummary() {

    const transactions = getTransactions();

    const incomeTotal = transactions
        .filter(transaction => transaction.type === "income")
        .reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

    const expenseTotal = transactions
        .filter(transaction => transaction.type === "expense")
        .reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

    const balanceTotal =
        incomeTotal - expenseTotal;

    balance.textContent =
        `Rs. ${balanceTotal.toLocaleString()}`;

    income.textContent =
        `Rs. ${incomeTotal.toLocaleString()}`;

    expense.textContent =
        `Rs. ${expenseTotal.toLocaleString()}`;

}