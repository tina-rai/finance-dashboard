function SummaryCards({ balance, income, expenses }) {

    const formatMoney = (amount) =>
        `$${amount.toFixed(2)}`;

    return (
        <section className="summary-grid">

            <div className="summary-card">
                <h3>Balance</h3>
                <p>{formatMoney(balance)}</p>
            </div>

            <div className="summary-card">
                <h3>Income</h3>
                <p>{formatMoney(income)}</p>
            </div>

            <div className="summary-card">
                <h3>Expenses</h3>
                <p>{formatMoney(expenses)}</p>
            </div>

        </section>
    );
}

export default SummaryCards;