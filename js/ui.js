function renderTransactions() {

    transactionList.innerHTML = "";

    const transactions=
    getTransactions().filter(transaction=>
    
    transaction.title
    .toLowerCase()
    .includes(
    
    searchInput.value.toLowerCase()
    
    )
    
    );
    switch (sortSelect.value) {

        case "newest":
            transactions.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            break;
    
        case "oldest":
            transactions.sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            );
            break;
    
        case "highest":
            transactions.sort(
                (a, b) => b.amount - a.amount
            );
            break;
    
        case "lowest":
            transactions.sort(
                (a, b) => a.amount - b.amount
            );
            break;
    
    }

    transactions.forEach((transaction, index) => {

        const card =
            document.createElement("div");

            card.className = `transaction-card ${transaction.type}`;

            card.innerHTML = `
            
            <div class="transaction-info">
            
                <h3>${transaction.title}</h3

                <p>${transaction.category}</p>

<small>
    ${new Date(transaction.date).toLocaleDateString()}
</small>
            
            
            </div>
            
            <div class="transaction-right">
            
                <strong>
            
                    ${transaction.type==="income" ? "+" : "-"}
            
                    Rs. ${transaction.amount.toLocaleString()}
            
                </strong>
            
                <button
                    class="delete-btn"
                    data-id="${index}"
                >
                    🗑
                </button>
            
            </div>
            
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