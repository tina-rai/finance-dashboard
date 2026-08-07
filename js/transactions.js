//This file is responsible only for adding transactions.

function addTransaction(transaction) {

    const transactions =
        getTransactions();

    transactions.push(transaction);

    saveTransactions(transactions);

}

function deleteTransaction(id) {

    const transactions = getTransactions().filter(
        transaction => transaction.id !== id
    );

    saveTransactions(transactions);

}

function updateTransaction(id, updatedTransaction) {

    const transactions = getTransactions();

    const index = transactions.findIndex(
        transaction => transaction.id === id
    );

    if (index !== -1) {

        transactions[index] = updatedTransaction;

        saveTransactions(transactions);

    }

}