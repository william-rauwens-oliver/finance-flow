import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

function CategoryChart({ transactions, budgets }) {
    const [categoryNames, setCategoryNames] = useState({}); // Stocke les noms des catégories

    useEffect(() => {
        const fetchCategoryNames = async () => {
            try {
                const response = await axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php?getCategories=true');
                const categories = response.data.categories || [];
                const categoryMap = categories.reduce((acc, category) => {
                    acc[category.id] = category.nom; // Associe l'ID de catégorie à son nom
                    return acc;
                }, {});
                setCategoryNames(categoryMap);
            } catch (error) {
                console.error("Erreur lors de la récupération des noms des catégories :", error);
            }
        };

        fetchCategoryNames();
    }, []);

    // Calculer les données des dépenses par catégorie
    const categoriesData = transactions.reduce((acc, transaction) => {
        const categoryId = transaction.categorie_id;
        acc[categoryId] = (acc[categoryId] || 0) + parseFloat(transaction.montant);
        return acc;
    }, {});

    // Construire les labels avec les noms des catégories
    const labels = Object.keys(categoriesData).map(categoryId => categoryNames[categoryId] || `Catégorie ${categoryId}`);
    const data = Object.values(categoriesData);

    const budgetData = Object.keys(categoriesData).map(categoryId => budgets[categoryId] || 0);

    const chartData = {
        labels: labels, // Affiche les noms des catégories
        datasets: [
            {
                label: 'Dépenses',
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
            {
                label: 'Budgets',
                data: budgetData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
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