form.addEventListener("submit", event => {

    event.preventDefault();

    const title = titleInput.value.trim();
const amount = Number(amountInput.value);

if (title === "" || amount <= 0) {
    alert("Please fill all fields correctly.");
    return;
}

const transaction = {
    title: titleInput.value.trim(),
    amount: Number(amountInput.value),
    category: categoryInput.value,
    type: typeInput.value,
    date: new Date().toISOString()
};


if (
    transaction.title === "" ||
    transaction.amount <= 0
) {

    alert("Please enter valid transaction details.");

    return;
}
    addTransaction(transaction);

    renderTransactions();

    form.reset();

});

renderTransactions();

transactionList.addEventListener("click",(event)=>{

    if(!event.target.classList.contains("delete-btn")){

        return;

    }

    const index=
        Number(event.target.dataset.id);

    deleteTransaction(index);

    renderTransactions();

});

searchInput.addEventListener("input",()=>{

    renderTransactions();
    
    });

    sortSelect.addEventListener(
        "change",
        renderTransactions
    );