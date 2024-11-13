import React from 'react';
import { Pie } from 'react-chartjs-2';

function CategoryChart({ transactions }) {
    const categoriesData = transactions.reduce((acc, transaction) => {
        const category = transaction.categorie_id;
        acc[category] = (acc[category] || 0) + parseFloat(transaction.montant);
        return acc;
    }, {});

    const labels = Object.keys(categoriesData).map(categoryId => `Catégorie ${categoryId}`);
    const data = Object.values(categoriesData);

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    return (
        <div>
            <h2>Répartition des Dépenses par Catégorie</h2>
            <Pie data={chartData} />
        </div>
    );
}

export default CategoryChart;
