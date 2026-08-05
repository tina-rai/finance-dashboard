//This file is responsible only for adding transactions.

function addTransaction(transaction) {

    const transactions =
        getTransactions();

    transactions.push(transaction);

    saveTransactions(transactions);

}