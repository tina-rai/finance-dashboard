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

function deleteTransaction(index){

    const transactions=getTransactions();

    transactions.splice(index,1);

    saveTransactions(transactions);

}
function updateTransaction(index, updatedTransaction) {

    const transactions = getTransactions();

    transactions[index] = updatedTransaction;

    saveTransactions(transactions);

}

function getTransaction(index) {

    return getTransactions()[index];

}