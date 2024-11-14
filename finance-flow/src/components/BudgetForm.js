// src/components/BudgetForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BudgetForm.css';

function BudgetForm() {
    const [categories, setCategories] = useState([]);
    const [budgets, setBudgets] = useState({});

    // Récupérer les catégories et les budgets
    useEffect(() => {
        axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php?getCategories=true')
            .then(response => {
                setCategories(response.data.categories || []);
                return axios.get('http://localhost:8888/finance-flow/finance-flow/src/api.php?getBudgets=true');
            })
            .then(budgetResponse => setBudgets(budgetResponse.data.reduce((acc, { categorie_id, budget }) => ({ ...acc, [categorie_id]: budget }), {})))
            .catch(error => console.error("Erreur lors de la récupération des données :", error));
    }, []);

    // Mettre à jour le budget pour une catégorie spécifique
    const handleBudgetChange = (categoryId, amount) => {
        axios.post('http://localhost:8888/finance-flow/finance-flow/src/api.php', {
            categoryId,
            budget: amount
        })
        .then(() => alert("Budget mis à jour avec succès"))
        .catch(error => console.error("Erreur lors de la mise à jour du budget :", error));
    };

    return (
        <div className="budget-form-container">
            <div className="budget-form-header">Définir le budget par catégorie</div>
            <form className="budget-form">
                {categories.map(category => (
                    <div key={category.id} className="budget-item">
                        <label>{category.nom}:</label>
                        <input
                            type="number"
                            placeholder="Budget"
                            defaultValue={budgets[category.id] || 0}
                            onBlur={(e) => handleBudgetChange(category.id, e.target.value)}
                        />
                    </div>
                ))}
                <button type="submit" className="budget-submit-btn">Enregistrer les Budgets</button>
            </form>
        </div>
    );
}

export default BudgetForm;
