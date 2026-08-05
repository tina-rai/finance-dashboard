form.addEventListener("submit", event => {

    event.preventDefault();

    const transaction = {

        title:
            titleInput.value.trim(),

        amount:
            Number(amountInput.value),

        category:
            categoryInput.value,

        type:
            typeInput.value

    };

    addTransaction(transaction);

    renderTransactions();

    form.reset();

});

renderTransactions();