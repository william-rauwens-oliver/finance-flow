import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function HistoryChart({ transactions }) {
    // Préparer les données pour l'historique des transactions
    const transactionDates = transactions.map((t) => t.date);
    const transactionAmounts = transactions.map((t) => t.montant);

    // Calculer le solde cumulatif
    let cumulativeBalance = 0;
    const cumulativeBalances = transactions.map((t) => {
        cumulativeBalance += t.type === 'revenu' ? parseFloat(t.montant) : -parseFloat(t.montant);
        return cumulativeBalance;
    });

    // Configuration pour le graphique de l'historique des transactions
    const transactionData = {
        labels: transactionDates,
        datasets: [
            {
                label: 'Historique des Transactions',
                data: transactionAmounts,
                fill: false,
                borderColor: 'blue',
                backgroundColor: 'blue',
                tension: 0.1,
            },
        ],
    };

    // Configuration pour le graphique du solde cumulatif
    const cumulativeData = {
        labels: transactionDates,
        datasets: [
            {
                label: 'Solde Cumulatif',
                data: cumulativeBalances,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.1,
            },
        ],
    };

    return (
        <div>
            <div>
                <h3>Historique des Transactions</h3>
                <Line data={transactionData} />
            </div>
            <div>
                <h3>Solde Cumulatif</h3>
                <Line data={cumulativeData} options={{
                    plugins: {
                        legend: {
                            display: true,
                        },
                    },
                    elements: {
                        line: {
                            fill: true,  // Força explicitement le remplissage
                        },
                    },
                }} />
            </div>
        </div>
    );
}

export default HistoryChart;
