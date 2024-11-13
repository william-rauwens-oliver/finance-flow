import React from 'react';
import { Line } from 'react-chartjs-2';

function HistoryChart({ transactions }) {
    const dates = transactions.map(transaction => transaction.date);
    const amounts = transactions.map(transaction => 
        transaction.type === 'revenu' ? parseFloat(transaction.montant) : -parseFloat(transaction.montant)
    );
    
    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Historique des Transactions',
                data: amounts,
                borderColor: '#36A2EB',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <h2>Historique des Transactions</h2>
            <Line data={chartData} />
        </div>
    );
}

export default HistoryChart;
