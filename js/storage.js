function getTransactions() {

    return JSON.parse(
        localStorage.getItem("transactions")
    ) || [];

}

function saveTransactions(transactions) {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


function getTransaction(id) {

    return getTransactions().find(
        transaction => transaction.id === id
    );

}