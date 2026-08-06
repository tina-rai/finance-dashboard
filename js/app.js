if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

    themeToggle.textContent=
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
        title,
        amount,
        category: categoryInput.value,
        type: typeInput.value,
        date: new Date().toISOString()
    };

    if (editingIndex === -1) {

        addTransaction(transaction);

    } else {

        updateTransaction(
            editingIndex,
            transaction
        );

        editingIndex = -1;

        form.querySelector("button").textContent =
            "Add Transaction";

    }

    renderTransactions();

    form.reset();

});

renderTransactions();

transactionList.addEventListener("click", event => {

    const index =
        Number(event.target.dataset.id);

    if (event.target.classList.contains("delete-btn")) {

        deleteTransaction(index);

        renderTransactions();

        return;

    }

    if (event.target.classList.contains("edit-btn")) {

        const transaction =
            getTransaction(index);

        titleInput.value =
            transaction.title;

        amountInput.value =
            transaction.amount;

        categoryInput.value =
            transaction.category;

        typeInput.value =
            transaction.type;

        editingIndex = index;

        form.querySelector("button").textContent =
            "Save Changes";

    }

});

searchInput.addEventListener("input",()=>{

    renderTransactions();
    
    });

    sortSelect.addEventListener(
        "change",
        renderTransactions
    );