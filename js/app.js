let editingIndex = null;

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent =
        "☀️ Light Mode";

}
themeToggle.addEventListener(
    "click",
    toggleTheme
);



form.addEventListener("submit", event => {

    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);

    if (title === "" || amount <= 0) {
        alert("Please fill all fields correctly.");
        return;
    }
    const transaction = {
        id: editingIndex === null ?
            Date.now() : editingIndex,

        title,
        amount,
        category: categoryInput.value,
        type: typeInput.value,
        date: new Date().toISOString()
    };

    if (editingIndex === null) {

        addTransaction(transaction);

    } else {
        console.log("Updating ID:", editingIndex);
        console.log("New transaction:", transaction);
        updateTransaction(
            editingIndex,
            transaction
        );

        editingIndex = null;

        form.querySelector("button").textContent =
            "Add Transaction";

    }

    renderTransactions();

    form.reset();

});

renderTransactions();

transactionList.addEventListener("click", event => {

    const id =
        Number(event.target.dataset.id);

    if (event.target.classList.contains("delete-btn")) {

        deleteTransaction(id);

        renderTransactions();

        return;

    }

    if (event.target.classList.contains("edit-btn")) {
        console.log("Edit clicked", id);

        const transaction =
            getTransaction(id);
        console.log(transaction);

        if (!transaction) {
            console.log("Transaction not found:", id);
            return;
        }


        titleInput.value =
            transaction.title;

        amountInput.value =
            transaction.amount;

        categoryInput.value =
            transaction.category;

        typeInput.value =
            transaction.type;

        editingIndex = id;

        form.querySelector("button").textContent =
            "Save Changes";

    }

});

searchInput.addEventListener("input", () => {

    renderTransactions();

});

sortSelect.addEventListener(
    "change",
    renderTransactions
);

exportButton.addEventListener("click", () => {

    const transaction =
        getTransaction(id);

    editingIndex = id;

    const rows = [

        ["Title", "Amount", "Category", "Type", "Date"],

        ...transactions.map(transaction =>

            [

                transaction.title,

                transaction.amount,

                transaction.category,

                transaction.type,

                transaction.date

            ]

        )

    ];

    const csv =
        rows.map(row => row.join(",")).join("\n");

    const blob =
        new Blob([csv], { type: "text/csv" });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download = "transactions.csv";

    link.click();

});