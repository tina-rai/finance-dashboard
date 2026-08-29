
function SummaryCards({
    usdBalance,
    usdIncome,
    usdExpenses,
    nprBalance,
    nprIncome,
    nprExpenses
}) {

    const formatUSD = (amount) =>
        `$${Number(amount).toFixed(2)}`;

    const formatNPR = (amount) =>
        `रू ${Number(amount).toFixed(2)}`;

    return (
        <section className="summary-grid">

            <div className="summary-card">
                <h3>Balance</h3>

                <p>
                    {formatUSD(usdBalance)}
                </p>

                <p>
                    {formatNPR(nprBalance)}
                </p>
            </div>

            <div className="summary-card">
                <h3>Income</h3>

                <p>
                    {formatUSD(usdIncome)}
                </p>

                <p>
                    {formatNPR(nprIncome)}
                </p>
            </div>

            <div className="summary-card">
                <h3>Expenses</h3>

                <p>
                    {formatUSD(usdExpenses)}
                </p>

                <p>
                    {formatNPR(nprExpenses)}
                </p>
            </div>

        </section>
    );
}

export default SummaryCards;